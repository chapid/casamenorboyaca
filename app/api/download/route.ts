
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { type NextRequest } from 'next/server'
/**
 * This route is used to get presigned url for downloading file from S3
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const key = searchParams.get('filename')

  if (!key || typeof key !== "string") {  
    return new Response(`Missing or invalid id`, {
      status: 400,
    })  
  }
  console.log('key',key);
  try {
    const client = new S3Client({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },               
    })
    // GetObjectCommand: used to generate a pre-signed URL for viewing.
    const getCommand = new GetObjectCommand({
        Key: key,
        Bucket: process.env.AWS_BUCKET_NAME,
      })
    // Generate pre-signed URL for PUT request
    const url = await getSignedUrl(client, getCommand, { expiresIn: 60 })
    return new Response('Link generado exitosamente', {
      status: 200,
      headers: { url },
    })    
  } catch (error: any) {
    console.error('Error:', error)
    return new Response(`Error de generacion ${error.message}`, {
      status: 400,
    })
  }  

}