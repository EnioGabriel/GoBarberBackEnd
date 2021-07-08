import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStoreProvider from "./StorageProvider/implementations/DiskStorageProvider";

import EtherealMailProvider from "./MailProvider/implementations/EtherealMailProvider";
import IMailProvider from "./MailProvider/models/IMailProvider";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStoreProvider
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  new EtherealMailProvider()
);
