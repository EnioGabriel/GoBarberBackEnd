import { container } from "tsyringe";

import IStorageProvider from "./models/IStorageProvider";

import DiskStoreProvider from "./implementations/DiskStorageProvider";

const providers = {
  disk: DiskStoreProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  providers.disk
);
