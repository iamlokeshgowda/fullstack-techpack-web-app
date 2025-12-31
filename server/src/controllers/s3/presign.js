import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

const s3 = new S3Client({ region });

const randomId = () => crypto.randomBytes(8).toString("hex");

export const presignFiles = async (req, res) => {
  try {
    const files = req.body.files || []; // [{ name, type, purpose }]

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const presigned = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop();
        const key = `uploads/${Date.now()}_${randomId()}_${file.name.replace(
          /[^a-zA-Z0-9.\-]/g,
          "_"
        )}`;

        // PUT URL for upload
        const putCommand = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: file.type || "application/octet-stream",
        });
        const putUrl = await getSignedUrl(s3, putCommand, { expiresIn: 300 });

        // Signed GET URL to store in DB (longer expiry, e.g., 7 days)
        const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
        const getUrl = await getSignedUrl(s3, getCommand, {
          expiresIn: 60 * 60 * 24 * 7,
        });

        return {
          name: file.name,
          key,
          putUrl,
          getUrl,
        };
      })
    );

    return res.json({ message: "Presigned URLs generated", data: presigned });
  } catch (err) {
    console.error("Presign error:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate presigned URLs" });
  }
};
