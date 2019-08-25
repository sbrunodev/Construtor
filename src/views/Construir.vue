<template>
  <div class="home">
    <div v-if="exibir=='inicio'" class="row" style="padding-top:10px;">
      <div class="col-lg-6">
        <label
          @click="config = !config"
          v-if="objGrupo.id!=0"
          class="display-4"
          style="font-size:25px;"
        >{{'#00'+objGrupo.id +' - '+ objGrupo.titulo}}</label>
      </div>

      <div class="col-lg-6">
        <button
          class="btn btn-md btn-success float-right btnTamanho margin-l15"
          @click="construirGrupo()"
        >Salvar</button>

        <button
          class="btn btn-md btn-default float-right btnTamanho margin-l15"
          @click="$emit('voltar')"
        >Cancelar</button>

        <button
          class="btn btn-md btn-danger float-right btnTamanho"
          @click="$emit('excluir',objGrupo.id)"
          v-if="objGrupo.id!=0"
        >Excluir</button>
      </div>
      <!--
      <ul class="nav justify-content-center">
        <li class="nav-item">
          <a class="nav-link active" @click="construirGrupo()">Voltar</a>
        </li>

        <li class="nav-item">
          <a class="nav-link active" @click="exibir='inicio'">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="exibir='bancodedados'">Banco de Dados</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="exibir='backend'">Back-End</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" @click="exibir='frontend'">Front-End</a>
        </li>
      </ul>
      -->
    </div>

    <hr />

    <div v-if="exibir=='inicio'">
      <div class="row" v-if="objGrupo.id == 0 || config">
        <div class="form-group col-4">
          <label>Titulo</label>
          <input
            type="text"
            v-model="titulo"
            v-on:keyup="keyUpTitulo()"
            class="form-control"
            placeholder="Titulo do Grupo"
          />
        </div>

        <div class="form-group col-8">
          <label>Descrição</label>
          <input
            type="text"
            v-model="descricao"
            class="form-control"
            placeholder="Descrição do Grupo"
          />
        </div>

        <div class="form-group col-4">
          <label>Banco de dados - Tabela</label>
          <input
            type="text"
            v-model="objBanco.nomeTabela"
            class="form-control"
            placeholder="Tabela no Banco de Dados. Exemplo.: tbClientes "
          />
        </div>

        <div class="form-group col-4">
          <label>Back-End - Classe</label>
          <input
            type="text"
            v-model="objClasse.nomeClasse"
            class="form-control"
            placeholder="Classe cs. Exemplo.: Cliente "
          />
        </div>

        <div class="form-group col-4">
          <label>Front-End - HTML e JS</label>
          <input
            type="text"
            v-model="objFrontEnd.nomeView"
            class="form-control"
            placeholder="HTML e JS. Exemplo.: Cliente "
          />
        </div>
      </div>

      <div v-if="objBanco.nomeTabela!=''">
        <label class="display-4" style="font-size:25px;">Banco de Dados - {{objBanco.nomeTabela}}</label>

        <button
          v-if="objBanco.tabela!=''"
          class="btn btn-sm btn-primary float-right btnTamanho margin-l15"
          @click="download('banco')"
        >download .sql</button>

        <button
          class="btn btn-sm btn-success float-right btnTamanho"
          @click="exibir='bancodedados'"
        >{{ objBanco.tabela==''?'Começar':'Visualizar' }}</button>

        <div class="form-group" v-if="objBanco.tabela!=''">
          <textarea class="form-control" v-model="objBanco.tabela" rows="10"></textarea>
        </div>
      </div>

      <div v-if="objClasse.nomeClasse!=''">
        <label class="display-4" style="font-size:25px;">Back-End - {{objClasse.nomeClasse}}</label>

        <button
          v-if="objClasse.classe!=''"
          class="btn btn-sm btn-primary float-right btnTamanho margin-l15"
          @click="download('backend')"
        >download .cs</button>

        <button
          class="btn btn-sm btn-success float-right btnTamanho"
          @click="exibir='backend'"
        >{{ objClasse.classe==''?'Começar':'Visualizar' }}</button>

        <div class="form-group" v-if="objClasse.classe!=''">
          <textarea class="form-control" v-model="objClasse.classe" rows="10"></textarea>
        </div>
      </div>

      <div v-if="objFrontEnd.nomeView!=''">
        <label class="display-4" style="font-size:25px;">Front-End - {{objFrontEnd.nomeView}}</label>

        <button
          v-if="objFrontEnd.view!=''"
          class="btn btn-sm btn-primary float-right btnTamanho margin-l15"
          @click="download('frontend')"
        >download .html</button>

        <button
          class="btn btn-sm btn-success float-right btnTamanho"
          @click="exibir='frontend'"
        >{{ objFrontEnd.view==''?'Começar':'Visualizar' }}</button>

        <div class="form-group" v-if="objFrontEnd.view!=''">
          <textarea class="form-control" v-model="objFrontEnd.view" rows="10"></textarea>
        </div>

        <div v-html="objFrontEnd.view" style="margin-bottom:15px;"></div>
      </div>
    </div>

    <CreateBanco
      v-if="exibir=='bancodedados'"
      @voltarInicio="exibir='inicio'"
      :nomeBancoDeDados="objBanco.nomeTabela"
      @recuperaCampos="carregaCampos"
      :camposObj="objBanco.campos"
    />

    <CreateBackEnd
      v-if="exibir=='backend'"
      :nomeBackEnd="objClasse.nomeClasse"
      @voltarInicio="exibir='inicio'"
      @recuperaCampos="carregaCampos"
      :camposObj="objClasse.campos"
      :camposObjBanco="objBanco.campos"
    />

    <CreateFrontEnd
      v-if="exibir=='frontend'"
      :nomeFrontEnd="objFrontEnd.nomeView"
      @voltarInicio="exibir='inicio'"
      @recuperaCampos="carregaCampos"
      :camposObj="objFrontEnd.campos"
      :camposObjClasse="objClasse.campos"
    />

    <!--
    <div>
      <button
        class="btn btn-success form-control col-2 float-right semBorda"
        @click="$emit('voltar')"
      >Voltar</button>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CreateFrontEnd from "@/views/CreateFrontEnd.vue";
import CreateBanco from "@/views/CreateBanco.vue";
import CreateBackEnd from "@/views/CreateBackEnd.vue";

import ClassBancoDeDados from "@/class/ClassBancoDeDados.ts";
import ClassBackEnd from "@/class/ClassBackEnd.ts";
import ClassFrontEnd from "@/class/ClassFrontEnd.ts";

import ClassGrupo from "@/class/ClassGrupo.ts";

@Component({
  components: {
    CreateFrontEnd,
    CreateBanco,
    CreateBackEnd
  }
})
export default class Construir extends Vue {
  @Prop() private objGrupo!: ClassGrupo;

  objBanco = this.objGrupo.objBanco;
  objClasse = this.objGrupo.objClasse;
  objFrontEnd = this.objGrupo.objFrontEnd;
  titulo: string = this.objGrupo.titulo;
  descricao: string = this.objGrupo.descricao;

  config = false;

  exibir = "inicio";

  construirGrupo() {
    this.$emit("construirGrupo", {
      id: this.objGrupo.id,
      titulo: this.titulo,
      descricao: this.descricao,
      objBanco: this.objBanco,
      objClasse: this.objClasse,
      objFrontEnd: this.objFrontEnd
    });
  }

  download(tipo: string) {
    switch (tipo) {
      case "backend":
        this.initDownload(
          this.objClasse.nomeClasse + ".cs",
          this.objClasse.classe
        );
        break;
      case "frontend":
        //console.log(this.objFrontEnd);
        //alert(this.objFrontEnd.scriptValidacao());
        this.initDownload(
          this.objFrontEnd.nomeView + ".html",
          this.objFrontEnd.html()
        );
        break;
      case "banco":
        this.initDownload(
          this.objBanco.nomeTabela + ".sql",
          this.objBanco.tabela
        );
        break;
    }
  }

  keyUpTitulo() {
    let titulos = this.titulo.split(" ");

    let possivelTitulo = titulos[0];
    let possivelTituloBanco = "";

    if (this.titulo.length > 0) {
      possivelTitulo =
        possivelTitulo.charAt(0).toUpperCase() + possivelTitulo.slice(1);
      possivelTituloBanco = "tb" + possivelTitulo;
    }

    this.objBanco.nomeTabela = possivelTituloBanco;
    this.objClasse.nomeClasse = possivelTitulo;
    this.objFrontEnd.nomeView = possivelTitulo;
  }

  initDownload(filename: string, text: string) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  carregaCampos(params) {
    switch (params.id) {
      case "bancodedados":
        {
          this.objBanco.campos = params.campos;
          this.objBanco.CreateTable();
        }
        break;

      case "backend":
        {
          this.objClasse.campos = params.campos;
          this.objClasse.CreateClasse();
        }
        break;

      case "frontend":
        {
          this.objFrontEnd.campos = params.campos;
          this.objFrontEnd.CreateView();
        }
        break;
    }

    this.exibir = "inicio"; // exibir = inicio | bancodedados | backend | frontend
  }
}
</script>

<style>
li > a {
  font-size: 20px;
  cursor: pointer;
}

li > a:hover {
  color: #4b8dcf !important;
}

.btnTamanho {
  width: 120px;
}

.margin-l15 {
  margin-left: 15px;
}
</style>