<template>
  <div class="container">
    <div class="row titleConfig" style="margin-top:10px;background:#F6F6F6;">
      <div class="col-10">
        <label class="display-4" style="font-size:25px;">Classe - {{nomeBackEnd}}</label>
      </div>

      <div class="col-2" v-if="campos.length != 0">
        <button class="btn btn-success form-control pull-right semBorda" @click="salvar">Salvar</button>
      </div>
    </div>

    <div id="helpBanco" v-if="campos.length == 0">
      <label class="display-4" style="font-size:25px;">Vamos começar !</label>

      <div v-if="camposBanco.length != 0">
        <p>
          Notamos que você ainda não definiu nenhum atributo para sua classe, porém já criou os campos da sua
          <b>tabela do banco de dados</b>. Deseja criar sua classe através dele ?
        </p>
        <button
          class="btn btn-success form-control float-right semBorda"
          @click="criarClasseAtravesDoBanco()"
        >Sim, criar classe através de tabela do Banco de Dados</button>
      </div>

      <div>
        <p>Clique em "adicionar" e adicione seu primeiro campo para fazer parte da sua Classe</p>
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
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>

                <th scope="col">Regras</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody id="tbodyConfig">
              <tr v-for="(c ,index) in campos">
                <th scope="row" class="textcenter">{{index+1}}</th>

                <th scope="row">
                  <input type="text" placeholder="ID" v-model="campos[index].id" />
                </th>

                   <td>
                  <div class="row margin-0 padding-0">
                    <select class="form-control" v-model="campos[index].tipo"                     
                    v-bind:class="{'tamanhoCampo-33':( campos[index].tipo == 'classe' )}">
                    <option value="bool">Bool</option>
                    <option value="classe">Classe</option>
                    <option value="datetime">DateTime</option>
                    <option value="decimal">Decimal</option>
                    <option value="float">Float</option>
                    <option value="int">Int</option>
                    <option value="string">String</option>
                  </select>

                    <input
                      class="float-right tamanhoCampo-33"
                      type="text"
                      placeholder="Tabela"
                      v-if="campos[index].tipo == 'classe'"
                      v-model="campos[index].tipoNomeClasse"
                    />

                     <input
                      class="float-right tamanhoCampo-33"
                      type="text"
                      placeholder="Identificador"
                      v-if="campos[index].tipo == 'classe'"
                      v-model="campos[index].classeIdentificador"
                    />

                    
                   
                  </div>
                </td>

                <td>
                  <button
                    v-if="campos[index].id!=''"
                    class="btn btn-warning form-control"
                    @click="adicionarRegras(index)"
                  >Regras</button>
                </td>

                <td>
                  <button class="btn btn-danger form-control" @click="removerCampo(index)">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div></div>
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
import ClassBackEnd from "../class/ClassBackEnd";

@Component({
  components: { ModalRegras }
})
export default class CreateBackEnd extends Vue {
  //campos = [];
  campo = {};
  showModal = false;
  id = "";
  listaRegrasAplicar = [];
  jsonText = "";
  csText = "";
  nomeClasse = "";

  @Prop() private nomeBackEnd!: string;
  @Prop() private camposObj!: [];
  campos = this.camposObj;

  @Prop() private camposObjBanco!: [];
  camposBanco = this.camposObjBanco;

  adicionarCampo() {
    let campo = {
      id: "",
      tipo: "string",
      tipoNomeClasse: "",
      classeIdentificador: "",
      validacoes: []
    };

    this.campos.push(campo);
    /*    
    let campos = [
      { id: "codigo", tipo: "int" },
      { id: "nome", tipo: "string" },
      { id: "sobrenome", tipo: "string" },
      { id: "datadenascimento", tipo: "datetime" },
      { id: "status", tipo: "bool" },
      { id: "cidade", tipo: "string" }
    ];
    */
    //this.nomeClasse = "Cliente";
    //this.campos = campos;
  }

  criarClasseAtravesDoBanco() {
    let obj = new ClassBackEnd("", []);
    obj.BancoParaClasse(this.camposObjBanco);
    this.campos = obj.campos;
  }

  removerCampo(index: number) {
    this.campos.splice(index, 1);
  }

  salvar() {
    this.$emit("recuperaCampos", { id: "backend", campos: this.campos });
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

.tamanhoCampo-0 {
  width: 0% !important;
}

.tamanhoCampo-50 {
  width: 50% !important;
}

.tamanhoCampo-100 {
  width: 100% !important;
}

.tamanhoCampo-33 {
  width: 33.33% !important;
}

.padding-0 {
  padding: 0px;
}

.margin-0 {
  margin: 0px;
}
</style>

