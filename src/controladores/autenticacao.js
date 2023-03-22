const jwt = require("jsonwebtoken");
const apiKey = require("../apiKey");

const conectar = (req, res, next) => {
  try {
    const { id, nome, email } = req.usuario;
    const token = jwt.sign(
      {
        id,
        nome,
        email,
      },
      apiKey,
      {
        expiresIn: "5h",
      }
    );

    return res.status(200).json({
      usuario: req.usuario,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  conectar,
};
