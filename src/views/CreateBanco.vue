<template>
  <div class="container">
    <div class="row titleConfig" style="margin-top:10px;background:#F6F6F6;">
      <div class="col-10">
        <label class="display-4" style="font-size:25px;">Banco de Dados - {{nomeBancoDeDados}}</label>
      </div>

      <div class="col-2" v-if="campos.length != 0">
        <button class="btn btn-success form-control pull-right semBorda" @click="salvar">Salvar</button>
      </div>
    </div>

    <div id="helpBanco" v-if="campos.length == 0">
      <label class="display-4" style="font-size:25px;">Vamos começar !</label>
      <p>
        Clique em "adicionar" e adicione seu primeiro campo para fazer parte da sua Tabela. Não se esqueça de definir uma
        <b>Primary Key</b>
      </p>

      <button
        class="btn btn-success form-control float-right semBorda"
        @click="adicionarCampo('primeiroCampo')"
      >Adicionar</button>
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
              @click="adicionarCampo('outrosCampos')"
            >Adicionar</button>
          </div>
        </div>

        <div v-if="campos.length != 0">
          <table id="tabelaConfig" class="table table-bordered table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">PK</th>
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>
                <th scope="col">
                  Tamanho do
                  <br />Campo
                </th>
                <th scope="col">
                  Chave
                  <br />Estrangeira
                </th>
                <th scope="col">
                  Auto
                  <br />Incremento
                </th>
                <th scope="col">
                  Permitir
                  <br />null
                </th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody id="tbodyConfig">
              <tr v-for="(c ,index) in campos">
                <th scope="row" class="textcenter">{{index+1}}</th>

                <td>
                  <input
                    type="radio"
                    name="pk"
                    :value="index"
                    v-model="primaryKeySelecionada"
                    style="width:40%;margin-left:15px;margin-top:-5px;"
                  />
                </td>

                <th scope="row">
                  <input type="text" placeholder="ID" v-model="campos[index].id" />
                </th>

                <td>
                  <select class="form-control" v-model="campos[index].tipo">
                    <option value="bool">Bool</option>
                    <option value="datetime">DateTime</option>
                    <option value="decimal">Decimal</option>
                    <option value="float">Float</option>
                    <option value="int">Int</option>
                    <option value="string">String</option>
                  </select>
                </td>

                <td>
                  <input
                    class="float-right"
                    type="text"
                    placeholder="Tamanho"
                    v-if="campos[index].tipo == 'string' || campos[index].tipo == 'float' || campos[index].tipo == 'decimal'"
                    v-model="campos[index].tamanhoCampo"
                  />
                </td>

                <td>
                  <div class="row margin-0 padding-0">
                    <select
                      class="form-control"
                      v-model="campos[index].chaveEstrangeira"
                      v-bind:class="{'tamanhoCampo-33':( campos[index].chaveEstrangeira == '1' )}"
                    >
                      <option value="0">Não</option>
                      <option value="1">Sim</option>
                    </select>

                    <input
                      class="float-right tamanhoCampo-33"
                      type="text"
                      placeholder="Tabela"
                      v-if="campos[index].chaveEstrangeira == '1'"
                      v-model="campos[index].tabelaEstrangeira"
                    />

                    <input
                      class="float-right tamanhoCampo-33"
                      type="text"
                      placeholder="Campo"
                      v-if="campos[index].chaveEstrangeira == '1'"
                      v-model="campos[index].campoEstrangeiro"
                    />
                  </div>
                </td>

                <td>
                  <select class="form-control" v-model="campos[index].ai">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </td>

                <td>
                  <select class="form-control" v-model="campos[index].isnull">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
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
@Component({
  components: { ModalRegras }
})
export default class CreateBanco extends Vue {
  campo = {};
  showModal = false;
  id = "";
  listaRegrasAplicar = [];
  jsonText = "";
  scriptText = "";
  nomeClasse = "";
  e1x = "  ";
  e2x = this.e1x + this.e1x;
  e3x = this.e2x + this.e1x;

  @Prop() private nomeBancoDeDados!: string;
  @Prop() private camposObj!: [];
  campos = this.camposObj;

  primaryKeySelecionada = 0;

  adicionarCampo(situacao: string) {
    let primaryKey = false;
    if (situacao == "primeiroCampo") this.primaryKeySelecionada = 0;
    console.log(this.primaryKeySelecionada);
    let campo = {
      id: "",
      pk: primaryKey,
      tipo: "string",
      tamanhoCampo: "",
      isnull: "0",
      ai: "0",
      chaveEstrangeira: "0",
      campoEstrangeiro: "",
      tabelaEstrangeira: "",
      validacoes: []
    };

    this.campos.push(campo);
    console.log(this.campos);
    /*let campos = [
      { id: "codigo", tipo: "int", pk: true, isnull: 0, ai: 0 },
      { id: "nome", tipo: "string", pk: false, isnull: 0, ai: 0 },
      { id: "sobrenome", tipo: "string", pk: false, isnull: 0, ai: 0 },
      {
        id: "datadenascimento",
        tipo: "datetime",
        pk: false,
        isnull: 0,
        ai: 0
      },
      { id: "status", tipo: "bool", pk: false, isnull: 0, ai: 0 },
      { id: "cidade", tipo: "string", pk: false, isnull: 0, ai: 0 }
    ];
    

    this.nomeClasse = "Cliente";
    this.campos = campos;
    this.atualizaJson();
    */
  }

  atualizaPk(index: number) {
    this.campos[index].pk = true;
    this.campos.forEach(c => {
      if (c.pk == null) c.pk = false;
    });
  }

  salvar() {
    this.campos[this.primaryKeySelecionada].pk = true;

    this.$emit("recuperaCampos", { id: "bancodedados", campos: this.campos });
  }

  removerCampo(index: number) {
    this.campos.splice(index, 1);
    this.atualizaJson();
  }

  atualizaJson() {
    this.jsonText = JSON.stringify(this.campos, undefined, 4);
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
#tabelaConfig > tbody > tr > td > div > input,
select,
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

