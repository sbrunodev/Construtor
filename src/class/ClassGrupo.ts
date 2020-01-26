import ClassBancoDeDados from "@/class/ClassBancoDeDados.ts";
import ClassBackEnd from "@/class/ClassBackEnd.ts";
import ClassBackEndCSharpOdbc from "@/class/ClassBackEndCSharpOdbc.ts";
import ClassBackEndNode from "@/class/ClassBackEndNode.ts";
import ClassFrontEnd from "@/class/ClassFrontEnd.ts";

export default class ClassGrupo {

    id: number = 0;
    titulo: string = "";
    descricao: string = "";
    objBanco = new ClassBancoDeDados("", []);
    objClasse: ClassBackEnd;
    objFrontEnd = new ClassFrontEnd("", []);

    tipoDb: string = "sqlserver";
    tipoBackEnd: string = "node";
    tipoFrontEnd: string = "htmljs";

    constructor() {
        this.objClasse = new ClassBackEndNode("", []);
    }

    instanciaClasses(tipoDb: string, tipoBackEnd: string) {
        
        console.log(`tipoDb: ${tipoDb} e tipoBackEnd: ${tipoBackEnd}`);

        switch (tipoBackEnd) {
            case 'csharpodbc': this.objClasse = new ClassBackEndCSharpOdbc("", []); break;
            case 'csharpef': this.objClasse = new ClassBackEndCSharpOdbc("", []); break;
            case 'php': this.objClasse = new ClassBackEndCSharpOdbc("", []); break;
            case 'node': this.objClasse = new ClassBackEndNode("", []); break;
        }
    }
}