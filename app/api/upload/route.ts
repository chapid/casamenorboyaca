// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { type NextRequest } from 'next/server'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
type Data = {
  url?: string,
  fields?: any,
  error?: any
};

export async function POST(req: Request) {
  const reqBody = await req.json();
  console.log(reqBody);
  const { filename, contentType } = await reqBody
  console.log(filename, contentType)

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    })
    // PutObjectCommand: used to generate a pre-signed URL for uploading
    const putCommand = new PutObjectCommand({
      Key: filename,
      ContentType: contentType,
      Bucket: process.env.AWS_BUCKET_NAME,
    })
    // Generate pre-signed URL for PUT request
    const url = await getSignedUrl(client, putCommand, { expiresIn: 600 })
    return new Response('Subida exitosa', {
      status: 200,
      headers: { url },
    }) 
  } catch (error: any) {
    return new Response(`Error de subida ${error.message}`, {
      status: 400,
    })
  }
}