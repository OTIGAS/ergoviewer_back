import { randomBytes, createCipheriv, createDecipheriv, scrypt } from "crypto";

import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: __dirname + "/./../../.env" });

export const UtilEncrypt = async (value) => {
  const iv = Buffer.from(randomBytes(16));
  const cipher = createCipheriv(
    process.env.ALGORITHM_CRYPTO,
    Buffer.from(process.env.CRYPTO_SECRET),
    iv
  );
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const UtilDecrypt = async (crypted) => {
  const [iv, encrypted] = crypted.split(":");
  const ivBuffer = Buffer.from(iv, "hex");
  const decipher = createDecipheriv(
    process.env.ALGORITHM_CRYPTO,
    Buffer.from(process.env.CRYPTO_SECRET),
    ivBuffer
  );
  let value = decipher.update(Buffer.from(encrypted, "hex"));
  value = Buffer.concat([value, decipher.final()]);
  return value.toString();
};

export const UtilGenerateHash = async (value) => {
  return new Promise((resolve) => {
    const salt = randomBytes(32).toString("hex");
    scrypt(value, salt, 256, (error, encrypted) => {
      resolve(`${salt}:${encrypted.toString("hex")}`);
    });
  });
};

export const UtilCheckHash = async (value, encrypted) => {
  return new Promise((resolve) => {
    const [salt, hash] = encrypted.split(":");
    scrypt(value, salt, 256, (error, encrypted) => {
      if (hash == encrypted.toString("hex")) resolve(true);
      resolve(false);
    });
  });
};
