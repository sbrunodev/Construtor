<template>
  <div class="container">
    <div class="row titleConfig" style="margin-top:10px;background:#F6F6F6;">
      <div class="col-10">
        <label class="display-4" style="font-size:25px;">Front End - {{nomeFrontEnd}}</label>
      </div>

      <div class="col-2" v-if="campos.length != 0">
        <button class="btn btn-success form-control pull-right semBorda" @click="salvar">Salvar</button>
      </div>
    </div>

    <div id="helpBanco" v-if="campos.length == 0">
      <label class="display-4" style="font-size:25px;">Vamos começar !</label>

      <div v-if="camposClasse.length != 0">
        <p>
          Notamos que você ainda não definiu nenhum atributo para seu HTML/JS, porém já criou os campos da sua
          <b>Classe - BackEnd</b>. Deseja criar seu HTML/JS através dele ?
        </p>
        <button
          class="btn btn-success form-control float-right semBorda"
          @click="criarHTMLJSAtravesDaClasse()"
        >Sim, criar HTML/JS através da Classe - BackEnd</button>
      </div>

      <div>
        <p>Clique em "adicionar" e adicione seu primeiro campo para fazer parte do seu HTML/JS</p>

        <button
          class="btn btn-success form-control float-right semBorda"
          @click="adicionarCampo()"
        >Adicionar</button>
      </div>
    </div>

    <div id="app" class="row" v-if="campos.length != 0">
      <div id="Tabela" class="col-12">
        <div class="row titleConfig">
          <div class="col-6">
            <label class="display-4" style="font-size:20px;">Configurações dos Campos</label>
          </div>

          <div class="col-6">
            <button
              class="btn btn-success form-control col-5 float-right semBorda"
              id="btnAdicionar"
              @click="adicionarCampo()"
            >Adicionar</button>
          </div>
        </div>

        <div v-if="campos.length != 0">
          <table id="tabelaConfig" class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Placeholder</th>
                <th scope="col">Tipo</th>
                <th scope="col">Coluna</th>
                <th scope="col">Regras</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody id="tbodyConfig">
              <tr v-for="(c ,index) in campos">
                <th scope="row" class="textcenter">{{index+1}}</th>

                <th scope="row">
                  <input
                    type="text"
                    placeholder="ID"
                    v-model="campos[index].id"
                    v-on:keyup="keyupID(index)"
                  />
                </th>

                <td>
                  <input type="text" placeholder="Nome" v-model="campos[index].titulo" />
                </td>

                <td>
                  <input type="text" placeholder="Placeholder" v-model="campos[index].placeholder" />
                </td>

                <td>
                  <select class="form-control" v-model="campos[index].tipo">
                    <option value="text">Text</option>
                    <option value="checkbox">CheckBox</option>
                    <option value="data">Data</option>
                    <option value="decimal">Decimal</option>
                    <option value="email">Email</option>
                    <option value="numero">Número</option>
                    <option value="select">Select</option>
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Tamanho da Coluna"
                    v-model="campos[index].tamanhoCol"
                  />
                </td>

                <td>
                  <button
                    v-if="campos[index].id!=''"
                    class="btn btn-warning form-control"
                    @click="adicionarRegras(index)"
                  >
                    Regras
                    <span class="badge badge-light">{{campos[index].validacoes.length}}</span>
                  </button>
                </td>

                <td>
                  <button class="btn btn-danger form-control" @click="removerCampo(index)">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ModalRegras
      v-if="showModal"
      @close="showModal = false"
      title="Configuração de regras"
      opcao="[{id:1, titulo:'Sim'},{id:2, titulo:'Não'}]"
      :campo="campo"
      :listaRegrasAplicar="listaRegrasAplicar"
      @opcaoSelecionada="recuperaRegras"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ModalRegras from "@/components/ModalRegras.vue";

import ClassFrontEnd from "@/class/ClassFrontEnd.ts";

@Component({
  components: { ModalRegras }
})
export default class CreateFrontEnd extends Vue {
  //campos = [];
  campo = {};
  showModal = false;
  id = "";
  listaRegrasAplicar = [];
  jsonText = "";

  @Prop() private nomeFrontEnd!: string;

  @Prop() private camposObj!: [];
  campos = this.camposObj;

  @Prop() private camposObjClasse!: [];
  camposClasse = this.camposObjClasse;

  adicionarCampo() {
    let campo = {
      id: "",
      titulo: "",
      placeholder: "",
      tipo: "text",
      validacoes: [],
      tamanhoCol: "6"
    };

    this.campos.push(campo);
    this.atualizaJson();
  }

  criarHTMLJSAtravesDaClasse() {
    let obj = new ClassFrontEnd("", []);
    obj.ClasseParaFrontEnd(this.camposClasse);
    this.campos = obj.campos;
  }

  removerCampo(index: number) {
    this.campos.splice(index, 1);
    this.atualizaJson();
  }

  keyupID(index: number) {
    let campo = this.campos[index];

    let possivelTitulo = campo.id;
    let possivelPlaceholder = "";

    if (campo.id.length > 0) {
      possivelTitulo =
        possivelTitulo.charAt(0).toUpperCase() + possivelTitulo.slice(1);
      possivelPlaceholder = "Informe o " + possivelTitulo;
    }

    campo.titulo = possivelTitulo;
    campo.placeholder = possivelPlaceholder;

    campo.tipo = this.getPossivelTipo(possivelTitulo);
  }

  getPossivelTipo(texto: string) {
    texto = texto.toLowerCase();
    let tipo = "";
    if (
      texto.includes("numero") ||
      texto.includes("nro") ||
      texto.includes("idade") ||
      texto.includes("quantidade")
    )
      tipo = "numero";

    if (
      texto.includes("valor") ||
      texto.includes("peso") ||
      texto.includes("altura")
    )
      tipo = "decimal";

    if (texto.includes("data")) tipo = "data";

    if (texto.includes("email")) tipo = "email";

    if (tipo == "") tipo = "text";

    return tipo;
  }

  getRegrasPorTipo(tipo: string) {
    var regras = [];

    switch (tipo) {
      case "text":
        {
          regras.push({ id: "nuncaVazio", descricao: "Nunca Vazio" });
          regras.push({ id: "tamanhoMinimo", descricao: "Tamanho Minimo" });
          regras.push({ id: "tamanhoMaximo", descricao: "Tamanho Maximo" });
          regras.push({ id: "cpf", descricao: "CPF" });
          regras.push({ id: "cnpj", descricao: "CNPJ" });
        }
        break;

      case "numero":
        {
          regras.push({ id: "nuncaVazio", descricao: "Nunca Vazio" });
          regras.push({ id: "valorMinimo", descricao: "Valor Minimo" });
          regras.push({ id: "valorMaximo", descricao: "Valor Maximo" });
        }
        break;

      case "decimal":
        {
          regras.push({ id: "nuncaVazio", descricao: "Nunca Vazio" });
          regras.push({ id: "valorMinimo", descricao: "Valor Minimo" });
          regras.push({ id: "valorMaximo", descricao: "Valor Maximo" });
        }
        break;
      case "select":
        {
          regras.push({ id: "nuncaVazio", descricao: "Nunca Vazio" });
        }
        break;
    }

    return regras;
  }

  salvar() {
    this.$emit("recuperaCampos", { id: "frontend", campos: this.campos });
  }

  atualizaJson() {
    this.jsonText = JSON.stringify(this.campos, undefined, 4);
  }

  adicionarRegras(index: number) {
    this.campo = this.campos[index];
    this.listaRegrasAplicar = this.getRegrasPorTipo(this.campos[index].tipo);
    this.showModal = true;
  }

  recuperaRegras(params) {
    let index = this.campos.findIndex(x => x.id === params.id);
    this.campos[index].validacoes = params.regras;
    this.showModal = false;
    this.atualizaJson();
  }
}
</script>



<style>
#tabelaConfig > tbody > tr > td,
#tabelaConfig > tbody > tr > th {
  padding: 0px;
}

#tabelaConfig > tbody > tr > td > input,
#tabelaConfig > tbody > tr > th > input,
#tabelaConfig > tbody > tr > td > select,
#tabelaConfig > tbody > tr > td > button {
  width: 100%;
  height: 40px;
  border: none !important;
  padding-left: 5px;
  border-radius: 0px;
}

.semBorda {
  border-radius: 0px !important;
}

.titleConfig {
  margin-bottom: 10px;
}

.textcenter {
  text-align: center;
}
</style>

