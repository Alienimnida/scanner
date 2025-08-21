import { DomainVerifier } from "@/app/lib/verification/domain-verification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, userId } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await DomainVerifier.verifyDomain(url, userId);

    console.log(`Domain verification result for ${url}:`, result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json({ 
      verified: false, 
      error: 'Verification failed' 
    }, { status: 500 });
  }
}