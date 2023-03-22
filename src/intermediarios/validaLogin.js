const bcrypt = require("bcrypt");
const conexao = require("../config/conexão");

const validaRequisicaoDoLogin = (req, res, next) => {
  const { email, senha } = req.body;

  try {
    if (!email || !email.trim()) {
      return res.status(400).json({ mensagem: "Informe o e-mail" });
    }
    if (!senha || !senha.trim()) {
      return res.status(400).json({ mensagem: "Informe a senha" });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const verificaSenha = async (req, res, next) => {
  try {
    const { senha } = req.body;
    const usuario = req.usuario;

    const compararSenha = await bcrypt.compare(senha, usuario.senha);

    if (!compararSenha) {
      return res
        .status(403)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;

    req.usuario = usuarioSemSenha;

    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  validaRequisicaoDoLogin,
  verificaSenha,
};
