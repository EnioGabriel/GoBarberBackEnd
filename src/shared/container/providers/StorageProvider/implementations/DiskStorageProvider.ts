import fs from "fs";
import path from "path";
import uploadConfig from "@config/upload";
import IStorageProvider from "../models/IStorageProvider";

class DiskStoreProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      // Pegando o arwuivo temp e movendo para dentro da pasta upload
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file)
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // Pegando caminho completo do arquivo
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // Caso não enconte o arquivo
    try {
      // Traz as infos do arquivo
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    // caso encontre o arquivo
    await fs.promises.unlink(filePath);
  }
}

export default DiskStoreProvider;
