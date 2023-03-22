const express = require("express");
const router = express.Router();

const transacaoControlador = require("../controladores/transacoes");
const { verificaToken } = require("../intermediarios/validaToken");

router.use(verificaToken);

router.post("/", transacaoControlador.cadastraTransacao);
router.get("/", transacaoControlador.listaTransacao);
router.get("/extrato", transacaoControlador.obterExtratoDaTransacao);
router.get("/:id", transacaoControlador.detalhaTransacao);
router.put("/:id", transacaoControlador.atualizaTransacao);
router.delete("/:id", transacaoControlador.deletaTransacao);

module.exports = router;
