import { container } from "tsyringe";
import uploadConfig from "@config/upload";

import IStorageProvider from "./models/IStorageProvider";

import S3StorageProvider from "./implementations/S3StorageProvider";
import DiskStoreProvider from "./implementations/DiskStorageProvider";

const providers = {
  disk: DiskStoreProvider, // armazenamento local (desenvolvimento)
  s3: S3StorageProvider, // armazenamento remoto (produção)
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  providers[uploadConfig.driver] // Define qual tipo de armazenamento
);
