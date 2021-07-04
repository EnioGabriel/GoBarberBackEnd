import IStorageProvider from "../models/IStorageProvider";

class FakeStoreProvider implements IStorageProvider {
  // Array de strings iniciando vazio
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // Percorrendo vetor para ver se tem o arquivo
    const findIndex = this.storage.findIndex(
      (storageFile) => storageFile === file
    );

    //removendo arquivo. 'findIndex, 1': removendo uma info apartir da posição encontrada
    this.storage.splice(findIndex, 1);
  }
}

export default FakeStoreProvider;
