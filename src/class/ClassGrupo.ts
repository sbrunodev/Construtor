import ClassBancoDeDados from "@/class/ClassBancoDeDados.ts";
import ClassBackEnd from "@/class/ClassBackEnd.ts";
import ClassFrontEnd from "@/class/ClassFrontEnd.ts";


export default class ClassGrupo {

    id: number = 0;
    titulo: string = "";
    descricao: string = "";
    objBanco = new ClassBancoDeDados("", []);
    objClasse = new ClassBackEnd("", []);
    objFrontEnd = new ClassFrontEnd("", []);

    constructor() {

    }
}