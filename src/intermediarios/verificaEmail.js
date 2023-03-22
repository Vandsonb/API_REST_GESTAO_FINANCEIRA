const conexao = require("../config/conexão");

const verificarDuplicidadeDeEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const query = "select * from usuarios where email = $1";
    const resultado = await conexao.query(query, [email]);

    if (resultado.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Este e-mail já foi cadastrado",
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const verificarExistenciaDoEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const query = "select * from usuarios where email = $1";
    const resultado = await conexao.query(query, [email]);

    if (resultado.rowCount == 0) {
      return res.status(404).json({ mensagem: "Este e-mail não existe" });
    }

    req.usuario = resultado.rows[0];

    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  verificarDuplicidadeDeEmail,
  verificarExistenciaDoEmail,
};
