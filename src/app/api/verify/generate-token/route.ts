import { DomainVerifier } from "@/app/lib/verification/domain-verification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { domain, userId } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const token = await DomainVerifier.generateVerificationToken(domain, userId);

    console.log(token)
    
    return NextResponse.json({
      token,
      instructions: {
        dns: `Add this TXT record to your DNS: cyberscope-verification=${token}`,
        html: `Add this meta tag to your homepage: <meta name="cyberscope-verification" content="${token}">`,
        file: `Create file at https://${domain}/.well-known/cyberscope-verification.txt with content: ${token}`
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}