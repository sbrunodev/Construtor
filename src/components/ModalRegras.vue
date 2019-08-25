<template>
  <div>
    <div name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper" style="padding-left:10%;padding-right:10%">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
              <button type="button" class="close" @click="$emit('close')">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="row titleConfig">
                <div class="col-6">
                  <h6>Configurações dos campos</h6>
                </div>

                <div class="col-6">
                  <button
                    class="btn btn-success form-control col-5 float-right semBorda"
                    id="btnAdicionar"
                    @click="adicionarRegra()"
                  >Adicionar</button>
                </div>
              </div>

              <div v-if="this.campo.validacoes.length != 0">
                <table id="tabelaConfig" class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Regra</th>
                      <th scope="col">Valor Esperado</th>
                      <th scope="col">Mensagem Erro</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyConfigRegras">
                    <tr v-for="(v,index) in campo.validacoes">
                      <td>
                        <select class="form-control" v-model="campo.validacoes[index].codigoRegra">
                          <option v-for="r in listaRegrasAplicar" :value="r.id">{{r.descricao}}</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="text"
                          v-if="campo.validacoes[index].codigoRegra != 'nuncaVazio'"
                          v-model="campo.validacoes[index].valorEsperado"
                          placeholder="Valor Esperado"
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          v-model="campo.validacoes[index].mensagemErro"
                          placeholder="Mensagem de Erro"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="clickOpcao(0)">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="clickOpcao(1)">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalRegras extends Vue {
  @Prop() private title!: string;
  @Prop() private tipo!: any;
  @Prop() private campo!: any;
  @Prop() private listaRegrasAplicar!: any;

  adicionarRegra() {
    this.campo.validacoes.push({
      codigoRegra: "",
      valorEsperado: "",
      mensagemErro: ""
    });
  }

  clickOpcao(tipo: number) {
    this.$emit("opcaoSelecionada", {
      id: this.campo.id,
      regras: this.campo.validacoes
    });
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 100px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>