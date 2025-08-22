
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause = userId ? { userId } : {};

    const history = await prisma.scanHistory.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        url: true,
        title: true,
        timestamp: true,
        totalScripts: true,
        totalCredentials: true,
        seoScore: true,
        status: true,
      }
    });

    const total = await prisma.scanHistory.count({
      where: whereClause
    });

    return NextResponse.json({
      history: history.map((item) => ({
        ...item,
        timestamp: item.timestamp.toISOString()
      })),
      total,
      hasMore: offset + limit < total
    });
   
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}