// Integrando bibliotecas internas
import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStoreProvider from "./StorageProvider/implementations/DiskStorageProvider";

import IMailTemplateProvider from "./MailTemplateProvider/models/IMailTemplateProvider";
import HandlebarsMailTemplateProvider from "./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";

import EtherealMailProvider from "./MailProvider/implementations/EtherealMailProvider";
import IMailProvider from "./MailProvider/models/IMailProvider";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStoreProvider
);

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  HandlebarsMailTemplateProvider
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  container.resolve(EtherealMailProvider)
);
