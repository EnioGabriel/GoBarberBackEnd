interface ITemplateVariables {
  // [key: string]: Aceitando qlqr objeto de chave string
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
