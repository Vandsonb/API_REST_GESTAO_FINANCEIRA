const express = require("express");

const rotasDeUsuarios = require("./rotas/usuarios");
const rotasDeAutenticacao = require("./rotas/autenticacao");
const rotasDeTransacao = require("./rotas/transacoes");
const rotasDeCategorias = require("./rotas/categorias");
const app = express();

app.use(express.json());

app.use("/usuario", rotasDeUsuarios);
app.use("/login", rotasDeAutenticacao);
app.use("/transacao", rotasDeTransacao);
app.use("/categoria", rotasDeCategorias);

app.listen(3000);
