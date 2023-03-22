const conexao = require("../config/conexão");

const listaCategorias = async (req, res, next) => {
  try {
    const query = `select * from categorias`;
    const resultadoListaCategoria = await conexao.query(query);

    return res.status(200).json(resultadoListaCategoria.rows);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  listaCategorias,
};
