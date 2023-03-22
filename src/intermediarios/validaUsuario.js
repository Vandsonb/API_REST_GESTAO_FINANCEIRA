const validarInformacoesDoUsuario = (req, res, next) => {
  const { nome, email, senha } = req.body;

  try {
    if (!nome || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe o nome",
      });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({
        mensagem: "Informe o e-mail",
      });
    }
    if (!senha || !senha.trim()) {
      return res.status(400).json({
        mensagem: "Informe a senha",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  validarInformacoesDoUsuario,
};
