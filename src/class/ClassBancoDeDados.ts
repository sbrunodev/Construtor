export default class ClassBancoDeDados {

    tabela: string = "";
    nomeTabela: string = "";
    campos = [];

    e1x: string = "  ";

    constructor(nomeTabela: string, campos: []) {
        this.nomeTabela = nomeTabela;
        //this.campos = campos;

        /*
        this.campos = [
            {
                id: "codigo",
                pk: true,
                tipo: "int",
                tamanhoCampo: "",
                isnull: "0",
                ai: "0",
                chaveEstrangeira: "0",
                campoEstrangeiro: "0",
                tabelaEstrangeira: "0",
                validacoes: []
            },
            {
                id: "descricao",
                pk: false,
                tipo: "string",
                tamanhoCampo: "100",
                isnull: "0",
                ai: "0",
                chaveEstrangeira: "0",
                campoEstrangeiro: "0",
                tabelaEstrangeira: "0",
                validacoes: []
            },
            {
                id: "valor",
                pk: false,
                tipo: "decimal",
                tamanhoCampo: "10,2",
                isnull: "0",
                ai: "0",
                chaveEstrangeira: "0",
                campoEstrangeiro: "0",
                tabelaEstrangeira: "0",
                validacoes: []
            },
            {
                id: "categoria",
                pk: false,
                tipo: "int",
                tamanhoCampo: "",
                isnull: "0",
                ai: "0",
                chaveEstrangeira: "1",
                campoEstrangeiro: "codigo",
                tabelaEstrangeira: "Categoria",
                validacoes: []
            },
            {
                id: "unidade",
                pk: false,
                tipo: "int",
                tamanhoCampo: "",
                isnull: "0",
                ai: "0",
                chaveEstrangeira: "1",
                campoEstrangeiro: "codigo",
                tabelaEstrangeira: "Unidade",
                validacoes: []
            }
        ]
        */

    }

    CreateTable() {
        this.tabela = "";
        this.tabela += "CREATE TABLE " + this.nomeTabela + " ( \n";

        let textoChavesEstrangeira = '';
        for (let i = 0; i < this.campos.length; i++) {

            let c = this.campos[i];
            let variavel = c.id + " ";
            //
            let tipo = c.tipo;
            switch (c.tipo) {
                case 'string': tipo = 'VARCHAR '; break;
            }

            variavel += tipo;

            if (c.tamanhoCampo != "")
                variavel += `(${c.tamanhoCampo})`;

            if (c.pk)
                variavel += ' PRIMARY KEY';

            if (c.ai == 1) variavel += " IDENTITY (1,1)";
            else
                if (c.isnull == 0)
                    variavel += " NOT NULL"

            if (c.chaveEstrangeira == 1) {
                if (textoChavesEstrangeira != "")
                    textoChavesEstrangeira += ", \n";
                textoChavesEstrangeira +=this.e1x + `FOREIGN KEY (${c.id}) REFERENCES ${c.tabelaEstrangeira}(${c.campoEstrangeiro})`;
            }

            //
            if (i + 1 < this.campos.length || textoChavesEstrangeira != "") variavel += ", ";

            this.tabela += this.e1x + variavel + "\n";

        }

        if (textoChavesEstrangeira != "")
            this.tabela += textoChavesEstrangeira + "\n";

        this.tabela += "); ";
    }



    /*
    bool
    dateTime
    decimal
    float
    int
    string
    */

    /*
    CREATE TABLE sales.visits (
        visit_id INT PRIMARY KEY IDENTITY (1, 1),
        first_name VARCHAR (50) NOT NULL,
        last_name VARCHAR (50) NOT NULL,
        visited_at DATETIME,
        phone VARCHAR(20),
        store_id INT NOT NULL,
        FOREIGN KEY (store_id) REFERENCES sales.stores (store_id)
    );
    */

}