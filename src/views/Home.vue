<template>
  <div class="home">
    <div id="divInicio" v-if="!iniciar">
      <label
        class="display-4"
        style="font-size:25px;"
      >Construa suas tabelas no banco, classes para seu back-end e seus layouts para o front-end de uma maneira fácil e prática.</label>

      <button
        class="btn btn-success form-control col-2 float-right semBorda"
        @click="abrirConstrutor(0)"
      >Criar</button>

      <div class="row" style="margin-top:50px;padding-top:10px;border-top:1px solid #e5e5e5">
        <div class="col-lg-4" v-for="(g ,index) in listaGrupos">
          <div class="card" style="width: 100%">
            <div class="card-body">
              <h5 class="card-title">{{'#00'+g.id+' - '+g.titulo}}</h5>
              <p class="card-text">{{g.descricao}}</p>

              <!--
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Cras justo odio</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item">Vestibulum at eros</li>
              </ul>
              -->

              <a href="#" class="btn btn-primary" @click="abrirConstrutor(g.id)">Abrir</a>

              <p class="card-text">
                <small class="text-muted">Atualizado em 27/07/2019 as 12:20</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="iniciar">
      <Construir
        @voltar="iniciar = false"
        @excluir="excluir"
        @construirGrupo="construirGrupo"
        :objGrupo="objGrupo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Construir from "@/views/Construir.vue"; // @ is an alias to /src

import ClassGrupo from "@/class/ClassGrupo.ts";

@Component({
  components: {
    Construir
  }
})
export default class Home extends Vue {
  iniciar = false;

  listaGrupos: ClassGrupo[] = new Array();
  objGrupo: ClassGrupo = new ClassGrupo();

  constructor() {
    super();
    if (localStorage.getItem("estrutura")) {
    
      const estrutura = localStorage.getItem("estrutura");
      let listaAux = JSON.parse(estrutura);
    
      for (let i = 0; i < listaAux.length; i++) {
        let g = listaAux[i];
        let objGrupo = new ClassGrupo();

        objGrupo.id = g.id;
        objGrupo.titulo = g.titulo;
        objGrupo.descricao = g.descricao;

        objGrupo.objBanco.campos = g.objBanco.campos;
        objGrupo.objBanco.nomeTabela = g.objBanco.nomeTabela;
        objGrupo.objBanco.CreateTable();

        objGrupo.objClasse.nomeClasse = g.objClasse.nomeClasse;
        objGrupo.objClasse.campos = g.objClasse.campos;
        objGrupo.objClasse.CreateClasse();

        objGrupo.objFrontEnd.nomeView = g.objFrontEnd.nomeView;
        objGrupo.objFrontEnd.campos = g.objFrontEnd.campos;
        objGrupo.objFrontEnd.CreateView();

        this.listaGrupos.push(objGrupo);
      }
    } else console.log("Não Existe");
  }

  construirGrupo(params) {
    let objGrupo = new ClassGrupo();

    objGrupo.titulo = params.titulo;
    objGrupo.descricao = params.descricao;
    objGrupo.objBanco = params.objBanco;
    objGrupo.objClasse = params.objClasse;
    objGrupo.objFrontEnd = params.objFrontEnd;

    if (params.id == 0) {
      objGrupo.id = this.getNovoId();

      this.listaGrupos.push(objGrupo);
    } else {
      objGrupo.id = params.id;
      let index = this.getPosicao(params.id);
      if (index != -1) this.listaGrupos[index] = objGrupo;
      else alert("Não foi possivel encontrar a tabela :s");
    }

    this.salvarStorage();

    this.iniciar = false;
  }

  excluir(id: number) {
    let index = this.getPosicao(id);
    if (index != -1) this.listaGrupos.splice(index, 1);
    this.iniciar = false;
    this.salvarStorage();
  }

  salvarStorage() {
    localStorage.setItem("estrutura", JSON.stringify(this.listaGrupos));
  }

  getNovoId() {
    let id = 0;
    this.listaGrupos.forEach(g => {
      if (g.id > id) id = g.id;
    });
    return id + 1;
  }

  getPosicao(id) {
    for (let i = 0; i < this.listaGrupos.length; i++)
      if (this.listaGrupos[i].id == id) return i;
    return -1;
  }

  abrirConstrutor(id: number) {
    if (id == 0) this.objGrupo = new ClassGrupo();
    else {
      let index = this.getPosicao(id);

      this.objGrupo = this.listaGrupos[index];
    }

    this.iniciar = true;
  }
}
</script>
