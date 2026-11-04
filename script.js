const API = "https://brasilapi.com.br/api/fipe";

const marca = document.querySelector("#marca");
const modelo = document.querySelector("#modelo");
const ano = document.querySelector("#ano");
const botao = document.querySelector("#consultar");
const status = document.querySelector("#status");
const resultado = document.querySelector("#resultado");

async function buscar(url) {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Não foi possível consultar a BrasilAPI.");
    return resposta.json();
}

function preencher(select, itens, campo, mensagem) {
    select.innerHTML = "<option value=''>" + mensagem + "</option>";

    itens.forEach((item) => {
        const opcao = document.createElement("option");
        opcao.value = item.valor;
        opcao.textContent = item[campo];
        select.appendChild(opcao);
    });

    select.disabled = false;
}

function limpar(select, mensagem) {
    select.innerHTML = "<option value=''>" + mensagem + "</option>";
    select.disabled = true;
}

async function carregarMarcas() {
    status.textContent = "Carregando marcas...";

    try {
        const marcas = await buscar(API + "/marcas/v1/carros");
        preencher(marca, marcas, "nome", "Selecione uma marca");
        status.textContent = "";
    } catch (erro) {
        status.textContent = erro.message;
    }
}

marca.addEventListener("change", async () => {
    limpar(modelo, "Carregando modelos...");
    limpar(ano, "Selecione o modelo primeiro");
    botao.disabled = true;
    resultado.textContent = "";
    status.textContent = "Carregando modelos...";

    try {
        const modelos = await buscar(API + "/veiculos/v1/carros/" + marca.value);
        preencher(modelo, modelos, "modelo", "Selecione um modelo");
        status.textContent = "";
    } catch (erro) {
        status.textContent = erro.message;
    }
});

modelo.addEventListener("change", async () => {
    limpar(ano, "Carregando anos...");
    botao.disabled = true;
    resultado.textContent = "";
    status.textContent = "Carregando anos...";

    try {
        const anos = await buscar(
            API + "/anos/v1/carros/" + marca.value + "/" + modelo.value
        );
        preencher(ano, anos, "nome", "Selecione ano e combustível");
        status.textContent = "";
    } catch (erro) {
        status.textContent = erro.message;
    }
});

ano.addEventListener("change", () => {
    botao.disabled = ano.value === "";
    resultado.textContent = "";
});

document.querySelector("#formulario").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    botao.disabled = true;
    status.textContent = "Consultando preço...";

    try {
        const dados = await buscar(
            API + "/detalhes/v1/carros/" + marca.value + "/" + modelo.value + "/" + ano.value
        );
        resultado.textContent = dados.marca + " " + dados.modelo +
            "\nPreço: " + dados.valor +
            "\nAno: " + dados.anoModelo +
            "\nCombustível: " + dados.combustivel;
        status.textContent = "Consulta concluída!";
    } catch (erro) {
        status.textContent = erro.message;
    } finally {
        botao.disabled = false;
    }
});

carregarMarcas();
