export default interface ClassBackEnd {

    classe: string;
    nomeClasse: string;
    campos: [];
    tipoBackEndDownload: string;

    e1x: string;
    e2x: string;
    e3x: string;

    constructor(nomeClasse: string, campos: []): void;

    BancoParaClasse(camposBanco: []): void;
    CreateClasse(): void;
    adicionarVariaveis(): string;
    adicionarMetodoConstrutor(): string;
    adicionarMetodoSalvar(): string;
    adicionarMetodoAlterar(): string;
    adicionarMetodoExcluir(): string;
    adicionarMetodoGet(): string;
    adicionarMetodoGetAll(): string;

}