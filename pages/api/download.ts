import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

/**
 * This route is used to get presigned url for downloading file from S3
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { key } = req.body;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ message: "Missing or invalid id" });
  }

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
    res.status(200).json({ url })
  } catch (error: any) {
    res.status(200).json({ error: error.message })
  }  

}