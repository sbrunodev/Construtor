import ClassBackEnd from './ClassBackEnd';

export default class ClassBackEndCSharpOdbc implements ClassBackEnd {

    classe: string = "";
    nomeClasse: string = "";
    campos: any[];
    tipoBackEndDownload: string = "cs";

    e1x = "  ";
    e2x = this.e1x + this.e1x;
    e3x = this.e2x + this.e1x;

    constructor(nomeClasse: string, campos: []) {
        this.nomeClasse = nomeClasse;
        this.campos = campos;
    }

    BancoParaClasse(camposBanco: []) {
        this.campos = [];
        camposBanco.forEach(c => {
            console.log(c);

            let nomeClasse: string = "";
            let tipo = c.tipo;

            if (c.chaveEstrangeira == 1) {
                nomeClasse = c.tabelaEstrangeira;
                tipo = "classe";
            }

            //classeIdentificador

            if (!c.pk) // Caso não seja pk
                this.campos.push({ id: c.id, tipo: tipo, tipoNomeClasse: nomeClasse, classeIdentificador: c.campoEstrangeiro, situacao: 'banco' });
            else
                this.campos.push({ id: c.id, tipo: tipo, tipoNomeClasse: nomeClasse, classeIdentificador: c.campoEstrangeiro, pk: c.pk, situacao: 'banco' });
        });
    }

    CreateClasse() {
        this.classe = "";

        this.classe += "public class " + this.nomeClasse + " {\n\n";

        this.classe += this.adicionarVariaveis();
        this.classe += this.adicionarMetodoConstrutor();
        this.classe += this.adicionarMetodoSalvar();
        this.classe += this.adicionarMetodoAlterar();
        this.classe += this.adicionarMetodoExcluir();
        this.classe += this.adicionarMetodoGet();
        this.classe += this.adicionarMetodoGetAll();

        this.classe += "}";
    }

    adicionarVariaveis() {
        let text = "";
        this.campos.forEach(c => {
            text += this.e1x + "public " + ((c.tipo == "classe") ? c.tipoNomeClasse : c.tipo) + " " + c.id + " { get; set; } \n";
        });
        return text + "\n\n";
    }

    adicionarMetodoConstrutor() {
        let text = "";
        text += this.e1x + "public " + this.nomeClasse + "(){\n";
        text += this.e1x + "";
        text += this.e1x + "}\n\n";

        let variaveis = "";
        for (let i = 0; i < this.campos.length; i++) {
            var c = this.campos[i];
            variaveis += ((c.tipo == "classe") ? c.tipoNomeClasse : c.tipo) + " " + c.id;

            if (i + 1 < this.campos.length) {
                variaveis += ", ";
            }
        }

        text += this.e1x + "public " + this.nomeClasse + "(" + variaveis + "){\n";
        text += this.e1x + "";
        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoSalvar() {
        let text = "";
        text += this.e1x + "public bool Salvar(){\n";
        text += this.e2x + "Conexao con = new Conexao();\n";

        let variaveis1 = "";
        let variaveis2 = "";
        let params = "";
        let sql = "";

        for (var i = 0; i < this.campos.length; i++) {
            var c = this.campos[i];
            variaveis1 += c.id;
            variaveis2 += "@" + c.id;

            params += this.e2x + `con.AddParameter("@${c.id}",  ${((c.tipo == "classe") ? c.id + "." + c.classeIdentificador : c.id)}  ); \n`;

            if (i + 1 < this.campos.length) {
                variaveis1 += ",";
                variaveis2 += ",";
            }
        }

        sql +=
            this.e2x +
            `string sql = "insert into (${variaveis1}) values (${variaveis2});"; \n\n`;

        text += sql;

        text += params + "\n";

        text += this.e2x + "return con.ExecuteComand(sql); \n";

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoAlterar() {
        let text = "";
        text += this.e1x + "public bool Alterar(){\n";
        text += this.e2x + "Conexao con = new Conexao();\n";

        let variaveis1 = "";
        let params = "";
        let sql = "";

        for (var i = 0; i < this.campos.length; i++) {
            var c = this.campos[i];
            variaveis1 += c.id + " = @" + c.id;
            params += this.e2x + `con.AddParameter("@${c.id}",${((c.tipo == "classe") ? c.id + "." + c.classeIdentificador : c.id)}); \n`;
            if (i + 1 < this.campos.length) variaveis1 += ",";
        }

        sql +=
            this.e2x +
            `string sql = "update ${this.nomeClasse} set ${variaveis1}) where codigo = @codigo ;"; \n\n`;

        text += sql;

        text += params + "\n";

        text += this.e2x + "return con.ExecuteComand(sql); \n";

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoExcluir() {
        let text = "";
        text += this.e1x + "public bool Excluir(){\n";
        text += this.e2x + "Conexao con = new Conexao();\n";

        let variaveis1 = "";
        let params = "";
        let sql = "";

        sql +=
            this.e2x +
            `string sql = "delete from ${this.nomeClasse} where codigo = @codigo ;"; \n`;

        text += sql;

        //text += params + "\n";

        text += this.e2x + "return con.ExecuteComand(sql); \n";

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoGet() {
        let text = "";
        text += this.e1x + "public " + this.nomeClasse + " Get(){\n";

        text += this.e2x + "Conexao con = new Conexao(); \n";
        text +=
            this.e2x +
            `string sql = "select * from ${this.nomeClasse} where codigo = @codigo";\n`;

        text += this.e2x + "DataTable dt = con.ExecuteDataTable(sql); \n";

        text += this.e2x + this.nomeClasse + " obj = null;\n";
        text += this.e2x + "if (dt.rows.coun > 0){\n";

        text += this.e2x + "obj = new " + this.nomeClasse + "();\n";

        this.campos.forEach(c => {
            let variavel = "",
                valorDt = "";

            variavel = "obj." + c.id + " = ";

            switch (c.tipo) {
                case "int":
                    valorDt = `Convert.ToInt32(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "datetime":
                    valorDt = `Convert.ToDateTime(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "decimal":
                    valorDt = `Convert.ToDecimal(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "classe":
                    valorDt = `new ${c.tipoNomeClasse}(Convert.ToInt32(dt.rows[0]["${c.id}"].ToString()))`;
                    break;
                default:
                    valorDt = `dt.rows[0]["${c.id}"].ToString()`;
                    break;
            }

            text += this.e3x + variavel + valorDt + ";\n";
        });

        text += this.e2x + "}\n";

        text += this.e2x + "return obj;\n";

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoGetAll() {
        let text = "";
        text += this.e1x + "public List<" + this.nomeClasse + "> GetAll(){\n";

        text += this.e2x + "Conexao con = new Conexao(); \n";
        text += this.e2x + `string sql = "select * from ${this.nomeClasse}";\n`;

        text += this.e2x + "DataTable dt = con.ExecuteDataTable(sql); \n";

        text += this.e2x + "List<" + this.nomeClasse + "> listObj = null;\n";
        text += this.e2x + "for(int i=0; i<dt.rows.count; i++){\n";

        text +=
            this.e2x + this.nomeClasse + " obj = new " + this.nomeClasse + "();\n";

        this.campos.forEach(c => {
            let variavel = "",
                valorDt = "";

            variavel = "obj." + c.id + " = ";

            switch (c.tipo) {
                case "int":
                    valorDt = `Convert.ToInt32(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "datetime":
                    valorDt = `Convert.ToDateTime(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "decimal":
                    valorDt = `Convert.ToDecimal(dt.rows[0]["${c.id}"].ToString())`;
                    break;
                case "classe":
                    valorDt = `new ${c.tipoNomeClasse}(Convert.ToInt32(dt.rows[0]["${c.id}"].ToString()))`;
                    break;
                default:
                    valorDt = `dt.rows[0]["${c.id}"].ToString()`;
                    break;
            }

            text += this.e3x + variavel + valorDt + ";\n";
        });

        text += this.e2x + "listObj.add(obj);\n";

        text += this.e2x + "}\n";

        text += this.e1x + "return listObj;\n";

        text += this.e1x + "}\n\n";

        return text;
    }


}