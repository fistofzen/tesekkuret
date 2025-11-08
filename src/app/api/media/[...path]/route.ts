import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = await params;
    const key = path.join('/');

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Convert stream to buffer
    const body = response.Body;
    const bytes = await body.transformToByteArray();
    const buffer = Buffer.from(bytes);

    // Set appropriate headers
    const headers = new Headers();
    if (response.ContentType) {
      headers.set('Content-Type', response.ContentType);
    }
    if (response.ContentLength) {
      headers.set('Content-Length', response.ContentLength.toString());
    }
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
