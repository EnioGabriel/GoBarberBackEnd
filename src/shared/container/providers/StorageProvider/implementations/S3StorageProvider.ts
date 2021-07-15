import fs from "fs";
import path from "path";
import mime from "mime";
import aws, { S3 } from "aws-sdk";
import uploadConfig from "@config/upload";
import IStorageProvider from "../models/IStorageProvider";

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: "us-east-1",
    });
  }
  public async saveFile(file: string): Promise<string> {
    // Pegando o arquivo temp e movendo para dentro da pasta upload
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    // lendo o conteudo
    const fileContent = await fs.promises.readFile(originalPath);

    // upload do conteudo
    await this.client
      .putObject({
        //Bucket: uploadConfig.config.aws.bucket,
        Bucket: uploadConfig.config.aws.bucket,
        Key: file, // nome do arquivo
        ACL: "public-read", // permissão publica do contudo
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath); // apagando do armazenamento local

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // Apagando arquivo
    await this.client
      .deleteObject({
        //Bucket: uploadConfig.config.aws.bucket,
        Bucket: "gobarber-rocketseat-curso",
        Key: file, // nome do arquivo
      })
      .promise();
  }
}

export default S3StorageProvider;
