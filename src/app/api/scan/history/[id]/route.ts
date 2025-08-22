import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const scanHistory = await prisma.scanHistory.findUnique({
      where: { id: params.id }
    });

    if (!scanHistory) {
      return NextResponse.json(
        { error: 'Scan result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scanHistory.scanResult);

  } catch (error) {
    console.error('Error fetching scan result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan result' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.scanHistory.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting scan result:', error);
    return NextResponse.json(
      { error: 'Failed to delete scan result' },
      { status: 500 }
    );
  }
}