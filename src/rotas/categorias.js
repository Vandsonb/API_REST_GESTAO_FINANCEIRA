const express = require("express");
const router = express.Router();

const controladorCategorias = require("../controladores/categorias");
const { verificaToken } = require("../intermediarios/validaToken");

router.use(verificaToken);

router.get("/", controladorCategorias.listaCategorias);

module.exports = router;
