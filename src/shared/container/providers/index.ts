import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStoreProvider from "./StorageProvider/implementations/DiskStorageProvider";

// Importtando dependencia
//import IMailProvider from './MailProvider/models/IMailProvider'

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStoreProvider
);
