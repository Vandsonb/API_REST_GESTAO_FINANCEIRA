const express = require("express");

const router = express.Router();

const usuarioControlador = require("../controladores/usuarios");
const {
  validarInformacoesDoUsuario,
} = require("../intermediarios/validaUsuario");
const {
  verificarDuplicidadeDeEmail,
} = require("../intermediarios/verificaEmail");
const { verificaToken } = require("../intermediarios/validaToken");

router.post(
  "/",
  validarInformacoesDoUsuario,
  verificarDuplicidadeDeEmail,
  usuarioControlador.cadastrarUsuario
);

router.use(verificaToken);

router.get("/", usuarioControlador.detalharUsuario);
router.put(
  "/",
  validarInformacoesDoUsuario,
  usuarioControlador.atualizaUsuario
);

module.exports = router;
