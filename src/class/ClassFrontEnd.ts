export default class ClassFrontEnd {

    view: string = "";
    nomeView: string = "";
    campos = [];

    e1x: string = "  ";

    constructor(nomeView: string, campos: []) {
        this.nomeView = nomeView;
        this.campos = campos;
    }

    ClasseParaFrontEnd(camposClasse: []) {
        /*
            id: "",
            titulo: "",
            placeholder: "",
            tipo: "text",
            validacoes: [],
            tamanhoCol: "6"
        */
        this.campos = [];
        camposClasse.forEach(c => {

            let objTituloEPlaceholder = this.getTituloPlaceholder(c.id);

            let iTamanhoCol = 6;
            if (c.pk == true)
                iTamanhoCol = 12;

            this.campos.push({
                id: c.id,
                titulo: objTituloEPlaceholder.titulo,
                placeholder: objTituloEPlaceholder.placeholder,
                tipo: this.getTipo(c.tipo),
                validacoes: [],
                tamanhoCol: iTamanhoCol
            });

            //if (!c.pk) // Caso não seja pk
            //    this.campos.push({ id: c.id, tipo: c.tipo, situacao: 'banco' });
            //else
            //this.campos.push({ id: c.id, tipo: c.tipo, pk: c.pk, situacao: 'banco' });
        });
    }

    getTipo(texto: string) {
        let resultado = "";
        switch (texto) {
            case "string": resultado = "text"; break;
            case "int": resultado = "numero"; break;
            case "datetime": resultado = "data"; break;
            case "classe": resultado = "select"; break;
            default: resultado = "text"; break;
        }
        return resultado;
    }

    getTituloPlaceholder(texto: string) {

        let possivelTitulo = texto;
        let possivelPlaceholder = "";

        if (texto.length > 0) {
            possivelTitulo =
                possivelTitulo.charAt(0).toUpperCase() + possivelTitulo.slice(1);
            possivelPlaceholder = "Informe o " + possivelTitulo;
        }

        return { titulo: possivelTitulo, placeholder: possivelPlaceholder };
    }

    CreateView() {
        this.view = '';

        this.view += '<div class="row">';
        for (var i = 0; i < this.campos.length; i++) {

            var c = this.campos[i];
            this.view += '<div class="form-group col-md-' + c.tamanhoCol + '"> \n';

            switch (c.tipo) {
                case 'text':
                case 'email':
                    this.view += '<label for="' + c.id + '">' + c.titulo + '</label> \n';
                    this.view += '<input autocomplete="off" type="' + c.tipo + '" class="form-control validaCampo" id="' + c.id + '" placeholder="' + c.placeholder + '"> \n';
                    ; break;

                case 'select':
                    this.view += '<label for="' + c.id + '">' + c.titulo + '</label> \n';
                    this.view += '<select class="form-control validaCampo" id="' + c.id + '">\n';
                    this.view += '<option value="-1">Selecione ' + c.titulo + '</option>\n';
                    this.view += '<option>1</option>\n';
                    this.view += '</select>\n';
                    ; break;

                case 'checkbox':
                    this.view += '<div class="form-check">\n';
                    this.view += '<input class="form-check-input validaCampo" type="checkbox" id="autoSizingCheck2">\n';
                    this.view += '<label class="form-check-label" for="autoSizingCheck2">\n';
                    this.view += c.titulo;
                    this.view += '</label>\n';
                    this.view += '</div>\n';
                    ; break;

                default:
                    this.view += '<label for="' + c.id + '">' + c.titulo + '</label> \n';
                    this.view += '<input autocomplete="off" type="' + c.tipo + '" class="form-control validaCampo" id="' + c.id + '" placeholder="' + c.placeholder + '"> \n';
                    ; break;
            }

            this.view += '<div class="col-md-12">\n';
            this.view += '   <small id="' + c.id + 'Help" class="text-danger">\n';
            this.view += '   </small>\n';
            this.view += '</div>\n';

            this.view += '</div>\n ';
        }
        this.view += "</div>";

        this.view += '<div class="row marginTopButton">\n';
        this.view += '   <button type="button" id="btnSalvar" class="btn btn-success">Salvar</button>\n';
        this.view += '</div>\n';

        return this.view;
    }

    scriptValidacao() {
        let validacao = [];
        this.campos.forEach(c => {
            let obj = {};
            obj.id = c.id;
            obj.tipo = c.tipo;
            obj.validacoes = c.validacoes;

            validacao.push(obj);
        });
        
        return JSON.stringify(validacao, undefined, 4);
    }

    html() {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${this.nomeView}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        
            <style>                        
            .inputError {
                border-color:red !important;
            }

            .inputOk{
                border-color:#c3d4da !important;
            }

            .marginTopButton{
                border-top:1px solid #E2E2E2;padding:10px 
            }
            </style>

            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            
            </head>
        
            <body>
            
                <div class="container">
                <h2 id="tituloPage">${this.nomeView}</h2>
                <hr/>
                    ${this.view}
                </div>
            </body>

            <script>
            
            //<script src="validarConstrutor.js">< / script>
            //alert('Construtor. by Bruno');
            //Validações
         
            $("#btnSalvar").click(function () {
                if (validaView()) {
                    alert('Validado');
                }
            })
        
            function addInputError(id) {
                $("#" + id).removeClass('inputOk').addClass('inputError');
            }
        
            function addInputOk(id) {
                $("#" + id).removeClass('inputError').addClass('inputOk');
            }
        
            function addMensagemErro(id, mensagem) {
                $("#" + id + "Help").html(mensagem);
            }
        
            $(".validaCampo").on('keyup change', function () {
                var id = $(this).attr('id');
                validaCampo(id, -1);
            });
        
            function getPosicao(id) {
                for (var i = 0; i < view.campos.length; i++) {
                    var c = view.campos[i];
                    if (c.id == id)
                        return i;
                }
                return -1;
            }
        
            function validaCampo(id, posicao) {
        
                var index = -1;
                if (posicao == -1)
                    index = getPosicao(id);
                else
                    index = posicao
        
                if (index != -1) {
        
                    var resultado = { mensagem: '', situacao: true };
                    var c = view.campos[index];
        
                    if (c.validacoes.length != 0) {
                        var texto = $("#" + c.id).val();
        
                        switch (c.tipo) {
                            case 'text':
                            case 'email':
                                {
                                    addInputOk(c.id);
                                    var validacoes = c.validacoes;
        
                                    validacoes.forEach(v => {
                                        var r = validacoesRegras(v, texto);
                                        if (r.situacao == false) // Erro encontrado
                                        {
                                            resultado.situacao = false;
                                            resultadoBool = false;
                                            addInputError(c.id);
                                            resultado.mensagem += r.mensagem + "<br/>";
                                        }
                                    });
                                    addMensagemErro(c.id, resultado.mensagem);
        
                                }; break;
                            case 'select':
                                {
                                    if (texto == "-1")
                                        addInputError(c.id);
                                    else
                                        addInputOk(c.id);
                                }; break;
                        }
                    }
                }
                else
                    console.log('Campo não encontrado');
            }
        
            function validaView() {
                var resultadoBool = true;
        
                for (var i = 0; i < view.campos.length; i++) {
                    var c = view.campos[i];
                    var resultado = { mensagem: '', situacao: true };
                    var resultadoAux = validaCampo(c.id, i);
        
                    if (!resultadoAux)
                        resultadoBool = false;
                }
        
                return resultadoBool;
            }
        
            function validacoesRegras(validacao, texto) {
        
                var resultado = { mensagem: '', situacao: true };
                switch (validacao.codigoRegra) {
        
                    case 'nuncaVazio': {
                        if (texto == null || texto == "undefined" || texto == "")
                            resultado.mensagem = 'Campo Obrigatório';
                    } break;
        
                    case 'tamanhoMinimo': {
                        if (validacao.valorEsperado > texto.length)
                            resultado.mensagem = (validacao.mensagemErro != "" ? validacao.mensagemErro : ('Valor minimo esperado é ' + validacao.valorEsperado));
        
                    } break;
        
                    case 'tamanhoMaximo':
                        if (validacao.valorEsperado < texto.length) {
                            resultado.mensagem = (validacao.mensagemErro != "" ? validacao.mensagemErro : ('Valor minimo esperado é ' + validacao.valorEsperado));
        
                        } break;
        
                    case 'contains': {
                        if (!texto.includes(validacao.valorEsperado))
                            resultado.mensagem = 'Não contem o valor esperado ' + validacao.valorEsperado;
        
                    } break;
                }
        
                if (resultado.mensagem != "")
                    resultado.situacao = false;
        
                return resultado;
            }

                var view = {};
                view.campos = ${this.scriptValidacao()}
            </script>
        
        </html>`;
    }

}