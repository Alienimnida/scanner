import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { DomainVerificationResult, VerificationToken } from '@/app/types/cyberscope';
import { prisma } from '@/app/lib/db';

export class DomainVerifier {
  static async generateVerificationToken(domain: string, userId?: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const normalizedDomain = this.normalizeDomain(domain);
    
    await prisma.verificationToken.deleteMany({
      where: { domain: normalizedDomain }
    });
    
    await prisma.verificationToken.create({
      data: {
        domain: normalizedDomain,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId
      }
    });
    
    return token;
  }

  static async verifyDomain(url: string, userId?: string): Promise<DomainVerificationResult> {
    try {
      const domain = this.extractDomain(url);
      
      const dnsResult = await this.verifyDNSTxtRecord(domain, userId);
      if (dnsResult.verified) {
        await this.markDomainAsVerified(domain, userId);
        return dnsResult;
      }

      const htmlResult = await this.verifyHTMLMetaTag(url, userId);
      console.log(htmlResult);
      if (htmlResult.verified) {
        await this.markDomainAsVerified(domain, userId);
        return htmlResult;
      }

      const fileResult = await this.verifyFile(domain, userId);
      if (fileResult.verified) {
        await this.markDomainAsVerified(domain, userId);
        return fileResult;
      }

      return {
        verified: false,
        error: 'Domain verification failed. Please use one of the verification methods.'
      };

    } catch (error) {
      return {
        verified: false,
        error: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private static async verifyDNSTxtRecord(domain: string, userId?: string): Promise<DomainVerificationResult> {
    try {
      const dns = await import('dns').then(m => m.promises);
      
      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          domain,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!tokenRecord) {
        return { verified: false, error: 'No verification token found for this domain' };
      }

      const txtRecords = await dns.resolveTxt(domain);
      const flatRecords = txtRecords.flat();
      
      const verificationRecord = flatRecords.find(record => 
        record.startsWith('cyberscope-verification=') && 
        record.includes(tokenRecord.token)
      );

      if (verificationRecord) {
        return { verified: true, method: 'DNS TXT Record' };
      }

      return { verified: false, error: 'DNS TXT record not found or invalid' };
    } catch (error) {
      return { verified: false, error: `DNS verification failed: ${error}` };
    }
  }

  private static async verifyHTMLMetaTag(url: string, userId?: string): Promise<DomainVerificationResult> {
    try {
      const domain = this.extractDomain(url);
      
      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          domain,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!tokenRecord) {
        return { verified: false, error: 'No verification token found for this domain' };
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'CyberScope-Verifier/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        return { verified: false, error: `HTTP ${response.status}: Could not fetch page` };
      }

      const html = await response.text();
      const metaTagRegex = new RegExp(`<meta\\s+name=["']cyberscope-verification["']\\s+content=["']${tokenRecord.token}["']`, 'i');
      
      if (metaTagRegex.test(html)) {
        return { verified: true, method: 'HTML Meta Tag' };
      }

      return { verified: false, error: 'HTML meta tag not found or invalid' };
    } catch (error) {
      return { verified: false, error: `HTML verification failed: ${error}` };
    }
  }

  private static async verifyFile(domain: string, userId?: string): Promise<DomainVerificationResult> {
    try {
      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          domain,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!tokenRecord) {
        return { verified: false, error: 'No verification token found for this domain' };
      }

      const verificationUrl = `https://${domain}/.well-known/cyberscope-verification.txt`;
      
      const response = await fetch(verificationUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CyberScope-Verifier/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        return { verified: false, error: `Verification file not found at ${verificationUrl}` };
      }

      const fileContent = await response.text();
      
      if (fileContent.trim() === tokenRecord.token) {
        return { verified: true, method: 'Verification File' };
      }

      return { verified: false, error: 'Verification file content does not match token' };
    } catch (error) {
      return { verified: false, error: `File verification failed: ${error}` };
    }
  }

  static async isDomainVerified(url: string, userId?: string): Promise<boolean> {
    const domain = this.extractDomain(url);
    
    const verification = await prisma.verifiedDomain.findUnique({
      where: { domain }
    });
    
    if (!verification) return false;
    
    if (userId && verification.userId && verification.userId !== userId) {
      return false;
    }
    
    return true;
  }

  static checkRateLimit(request: NextRequest): boolean {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimitKey = `rate_limit_${ip}`;
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 10;
    
    return true;
  }

  static isWhitelistedDomain(url: string): boolean {
    const domain = this.extractDomain(url);
    const whitelistedDomains = [
      'example.com',
      'httpbin.org',
      'jsonplaceholder.typicode.com',
      'prepverse.xyz',
      'orcaa.vercel.app'
    ];
    
    return whitelistedDomains.includes(domain);
  }

  static isSuspiciousDomain(url: string): boolean {
    const domain = this.extractDomain(url);
    const suspiciousPatterns = [
      /\.gov$/,
      /\.mil$/,
      /bank/i,
      /financial/i,
      /hospital/i,
      /health/i,
      /localhost/,
      /127\.0\.0\.1/,
      /192\.168\./,
      /10\./,
      /172\.(1[6-9]|2[0-9]|3[01])\./
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(domain));
  }

  static extractDomain(url: string): string {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return this.normalizeDomain(hostname);
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  private static normalizeDomain(domain: string): string {
    return domain.toLowerCase().replace(/^www\./, '');
  }

  private static async markDomainAsVerified(domain: string, userId?: string): Promise<void> {
    await prisma.verifiedDomain.upsert({
      where: { domain },
      update: { 
        verifiedAt: new Date(), 
        userId 
      },
      create: { 
        domain, 
        userId 
      }
    });
  }
}