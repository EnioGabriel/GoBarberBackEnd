import { container } from "tsyringe";

import IHashProvider from "./hashProvider/models/IHashProvider";
import BCryptHashProvider from "./hashProvider/implementations/BCryptHashProvider";

// Retorna uma função BCryptHashProvider qnd a chamada for HashProvider
container.registerSingleton<IHashProvider>("HashProvider", BCryptHashProvider);
