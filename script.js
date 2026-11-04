const API_BASE = "https://brasilapi.com.br/api/fipe";

const tipoVeiculo = document.getElementById("tipoVeiculo");
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const btnConsultar = document.getElementById("btnConsultar");
const formConsulta = document.getElementById("formConsulta");
const status = document.getElementById("status");
const resultado = document.getElementById("resultado");

function mostrarStatus(mensagem, tipo = "") {
    status.textContent = mensagem;
    status.className = `status ${tipo}`.trim();
}

function limparResultado() {
    resultado.replaceChildren();
    mostrarStatus("");
}

function prepararSelect(select, mensagem) {
    select.replaceChildren();
    const opcao = document.createElement("option");
    opcao.value = "";
    opcao.textContent = mensagem;
    select.appendChild(opcao);
    select.disabled = true;
}

async function buscarDados(url, mensagemErro) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(mensagemErro);
    }

    return await response.json();
}

function preencherSelect(select, itens, textoInicial, obterValor, obterTexto) {
    prepararSelect(select, textoInicial);

    itens.forEach((item) => {
        const opcao = document.createElement("option");
        opcao.value = obterValor(item);
        opcao.textContent = obterTexto(item);
        select.appendChild(opcao);
    });

    select.disabled = false;
}

async function carregarMarcas() {
    const tipo = tipoVeiculo.value;
    prepararSelect(marcaSelect, "Carregando marcas...");
    prepararSelect(modeloSelect, "Selecione uma marca primeiro");
    prepararSelect(anoSelect, "Selecione um modelo primeiro");
    btnConsultar.disabled = true;
    limparResultado();
    mostrarStatus("Carregando marcas... aguarde.");

    try {
        const marcas = await buscarDados(
            `${API_BASE}/marcas/v1/${tipo}`,
            "Não foi possível carregar as marcas. Tente novamente."
        );

        preencherSelect(marcaSelect, marcas, "Selecione uma marca", (marca) => marca.valor, (marca) => marca.nome);
        mostrarStatus("");
    } catch (erro) {
        prepararSelect(marcaSelect, "Marcas indisponíveis");
        mostrarStatus(erro.message, "erro");
    }
}

async function carregarModelos() {
    const tipo = tipoVeiculo.value;
    const codigoMarca = marcaSelect.value;
    prepararSelect(modeloSelect, "Carregando modelos...");
    prepararSelect(anoSelect, "Selecione um modelo primeiro");
    btnConsultar.disabled = true;
    limparResultado();
    mostrarStatus("Carregando modelos... aguarde.");

    try {
        const resposta = await buscarDados(
            `${API_BASE}/veiculos/v1/${tipo}/${codigoMarca}`,
            "Não foi possível carregar os modelos. Tente novamente."
        );

        preencherSelect(modeloSelect, resposta, "Selecione um modelo", (modelo) => modelo.valor, (modelo) => modelo.modelo);
        mostrarStatus("");
    } catch (erro) {
        prepararSelect(modeloSelect, "Modelos indisponíveis");
        mostrarStatus(erro.message, "erro");
    }
}

async function carregarAnos() {
    const tipo = tipoVeiculo.value;
    const codigoMarca = marcaSelect.value;
    const codigoModelo = modeloSelect.value;
    prepararSelect(anoSelect, "Carregando anos...");
    btnConsultar.disabled = true;
    limparResultado();
    mostrarStatus("Carregando anos e combustíveis... aguarde.");

    try {
        const anos = await buscarDados(
            `${API_BASE}/anos/v1/${tipo}/${codigoMarca}/${codigoModelo}`,
            "Não foi possível carregar os anos. Tente novamente."
        );

        preencherSelect(anoSelect, anos, "Selecione ano e combustível", (ano) => ano.valor, (ano) => ano.nome);
        mostrarStatus("");
    } catch (erro) {
        prepararSelect(anoSelect, "Anos indisponíveis");
        mostrarStatus(erro.message, "erro");
    }
}

function adicionarDetalhe(lista, rotulo, valor) {
    const item = document.createElement("div");
    const titulo = document.createElement("dt");
    const descricao = document.createElement("dd");
    titulo.textContent = rotulo;
    descricao.textContent = valor || "Não informado";
    item.append(titulo, descricao);
    lista.appendChild(item);
}

function mostrarResultado(dados) {
    resultado.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = `${dados.marca} ${dados.modelo}`;

    const preco = document.createElement("p");
    preco.className = "preco";
    preco.textContent = dados.valor;

    const detalhes = document.createElement("dl");
    detalhes.className = "detalhes";
    adicionarDetalhe(detalhes, "Ano do modelo", dados.anoModelo);
    adicionarDetalhe(detalhes, "Combustível", dados.combustivel);
    adicionarDetalhe(detalhes, "Código FIPE", dados.codigoFipe);
    adicionarDetalhe(detalhes, "Mês de referência", dados.mesReferencia);

    resultado.append(titulo, preco, detalhes);
}

async function consultarPreco(evento) {
    evento.preventDefault();
    const tipo = tipoVeiculo.value;
    const codigoMarca = marcaSelect.value;
    const codigoModelo = modeloSelect.value;
    const codigoAno = anoSelect.value;

    btnConsultar.disabled = true;
    limparResultado();
    mostrarStatus("Consultando o preço na Tabela FIPE... aguarde.");

    try {
        const dados = await buscarDados(
            `${API_BASE}/detalhes/v1/${tipo}/${codigoMarca}/${codigoModelo}/${codigoAno}`,
            "Não foi possível consultar esse veículo. Confira os dados e tente novamente."
        );

        mostrarResultado(dados);
        mostrarStatus("Consulta concluída.", "sucesso");
    } catch (erro) {
        mostrarStatus(erro.message, "erro");
    } finally {
        btnConsultar.disabled = false;
    }
}

tipoVeiculo.addEventListener("change", carregarMarcas);
marcaSelect.addEventListener("change", carregarModelos);
modeloSelect.addEventListener("change", carregarAnos);
anoSelect.addEventListener("change", () => {
    btnConsultar.disabled = anoSelect.value === "";
    limparResultado();
});
formConsulta.addEventListener("submit", consultarPreco);

carregarMarcas();
