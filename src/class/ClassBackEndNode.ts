import ClassBackEnd from './ClassBackEnd';

export default class ClassBackEndNode implements ClassBackEnd {

    classe: string = "";
    nomeClasse: string = "";
    campos: any[];
    tipoBackEndDownload: string = "js";

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

            if (!c.pk) // Caso não seja pk
                this.campos.push({ id: c.id, tipo: tipo, tipoNomeClasse: nomeClasse, classeIdentificador: c.campoEstrangeiro, situacao: 'banco' });
            else
                this.campos.push({ id: c.id, tipo: tipo, tipoNomeClasse: nomeClasse, classeIdentificador: c.campoEstrangeiro, pk: c.pk, situacao: 'banco' });
        });
    }

    CreateClasse() {
        this.classe += "/* ----- Model ----- */\n";

        this.classe += "const db = require('../../banco/dbConexao');\n\n";
        this.classe += "class " + this.nomeClasse + " {\n\n";

        //this.classe += this.adicionarVariaveis();
        //this.classe += this.adicionarMetodoConstrutor();
        this.classe += this.adicionarMetodoSalvar();
        this.classe += this.adicionarMetodoAlterar();
        this.classe += this.adicionarMetodoExcluir();
        this.classe += this.adicionarMetodoGet();
        this.classe += this.adicionarMetodoGetAll();

        this.classe += "}\n\n";

        this.classe += "module.exports = " + this.nomeClasse + "\n\n";

        this.classe += "/* ----- Fim - Model ----- */\n\n\n\n";

        this.classe += "/* ----- Router ----- */\n";

       

        this.classe += `var express = require('express');\n`
        this.classe += `var router = express.Router();\n`;
        this.classe += `var ${this.nomeClasse} = require('../model/${this.nomeClasse}');\n`;
        this.classe += `var RespostaClass = require('../model/RespostaClass');\n`;

        this.adicionarRequest('get', '', 'getTodos', '');
        this.adicionarRequest('get', ':id?', 'getId', 'req.params.id');
        this.adicionarRequest('post', '?', 'adicionar', 'req.body');
        this.adicionarRequest('delete', ':id', 'excluir', 'req.params.id');
        this.adicionarRequest('put', '', 'editar', 'req.body');

        this.classe += "\n";
        this.classe += `module.exports = router`;

        this.classe += "/* ----- Fim - Router ----- */\n";

    }

    adicionarRequest(tipoRequest: string, param: string, method: string, paramMethod: string) {

        let tipoRetorno = '';

        if (tipoRequest == 'get')
            tipoRetorno = `
            let resposta = new RespostaClass();
        
            if (erro) {
                resposta.erro = true;
                resposta.msg = "Ocorreu um erro.";
            }
            else
                resposta.data = retorno;
    
            resp.json(resposta);
            `;
        else
            tipoRetorno = `
            let resposta = new RespostaClass();
            if (erro) {
                resposta.erro = true;
                resposta.msg = "Ocorreu um erro";
                console.log('erro: ', erro);
            }
            else {
                if (retorno.affectedRows > 0) { // Quantas linhas foram afetadas
                    resposta.msg = "Operação realizada com Sucesso";
                }
                else {
                    resposta.erro = true;
                    resposta.msg = "Não foi possivel realizar a Operação";
                }
            }
            console.log('erro:', resposta);
            res.json(resposta);
            `;

        this.classe += `
        router.${tipoRequest}("${param}", function (req, resp, next) {
            ${this.nomeClasse}.${method}(${paramMethod}${paramMethod != "" ? ", " : ""}function (erro, retorno) {
               ${tipoRetorno}
            });
        });
        `;
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
        console.log('Método adicionar NODE');
   
        let text = "";
        text += this.e1x + "static adicionar(obj, callback){\n";

        let variaveis1 = "";
        let variaveis2 = "";
        let variaveis3 = "";
        let sql = "";

        for (var i = 0; i < this.campos.length; i++) {
            var c = this.campos[i];
            variaveis1 += c.id + " ";
            variaveis2 += "obj." + c.id + " ";
            variaveis3 += "? "

            if (i + 1 < this.campos.length) {
                variaveis1 += ",";
                variaveis2 += ",";
                variaveis3 += ",";
            }
        }

        sql +=
            this.e2x +
            `return db.query ("insert into ${this.nomeClasse} (${variaveis1}) values (${variaveis3})", [${variaveis2}], callback); \n\n`;

        text += sql;
        text += this.e1x + "}\n\n";
        return text;
    }

    adicionarMetodoAlterar() {
        let text = "";
        text += this.e1x + "static editar(obj, callback){\n";


        let variaveis1 = "";
        let variaveis2 = "";
        let params = "";
        let sql = "";

        for (var i = 0; i < this.campos.length; i++) {
            var c = this.campos[i];
            variaveis1 += c.id + " = ?";
            variaveis2 += "obj." + c.id

            if (i + 1 < this.campos.length) {
                variaveis1 += ", ";
                variaveis2 += ", ";
            }
        }

        sql +=
            this.e2x +
            `return db.query ("update ${this.nomeClasse} set ${variaveis1}) where codigo = ?", [${variaveis2}], callback); \n\n`;

        text += sql;

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoExcluir() {
        let text = "";
        text += this.e1x + "static deletar(id, callback){\n";

        text +=
            this.e2x +
            `return db.query ("delete from ${this.nomeClasse} where codigo = ?", [id], callback); \n`;

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoGet() {
        let text = "";
        text += this.e1x + "static getId(id, callback){\n";

        text +=
            this.e2x +
            `return db.query("select * from ${this.nomeClasse} where codigo = ?", [id], callback);\n`;

        text += this.e1x + "}\n\n";

        return text;
    }

    adicionarMetodoGetAll() {
        let text = "";
        text += this.e1x + "static getTodos(callback){\n";

        text +=
            this.e2x +
            `return db.query("select * from ${this.nomeClasse}", callback);\n`;

        text += this.e1x + "}\n\n";

        return text;
    }


}