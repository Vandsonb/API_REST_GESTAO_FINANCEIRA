const jwt = require("jsonwebtoken");
const apiKey = require("../apiKey");

const verificaToken = (req, res, next) => {
  try {
    let { authorization } = req.headers;

    const token = authorization.split(" ")[1];
    const usuario = jwt.verify(token, apiKey);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = {
  verificaToken,
};
