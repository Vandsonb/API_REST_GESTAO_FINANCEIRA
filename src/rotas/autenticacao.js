const express = require("express");
const router = express.Router();

const autenticacaoControlador = require("../controladores/autenticacao");
const {
  validaRequisicaoDoLogin,
  verificaSenha,
} = require("../intermediarios/validaLogin");
const {
  verificarExistenciaDoEmail,
} = require("../intermediarios/verificaEmail");

router.post(
  "/",
  validaRequisicaoDoLogin,
  verificarExistenciaDoEmail,
  verificaSenha,
  autenticacaoControlador.conectar
);

module.exports = router;
