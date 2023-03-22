const bcrypt = require("bcrypt");
const conexao = require("../config/conexão");

const cadastrarUsuario = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    let senhaCriptograda = await bcrypt.hash(senha, 10);

    const query =
      "insert into usuarios (nome,email,senha) values ($1,$2,$3) returning id,nome,email";
    const resultado = await conexao.query(query, [
      nome,
      email,
      senhaCriptograda,
    ]);

    if (resultado.rowCount == 0) {
      return res.status(404).json({
        mensagem: "Não foi possivel cadastrar o usuário",
      });
    }
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const detalharUsuario = async (req, res, next) => {
  try {
    let { iat, exp, ...infoUsuario } = req.usuario;
    return res.status(200).json(infoUsuario);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const atualizaUsuario = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    const usuario = req.usuario;
    let senhaCriptograda = await bcrypt.hash(senha, 10);

    const query = "select * from usuarios where email = $1 and id <> $2";
    const resultado = await conexao.query(query, [email, usuario.id]);

    if (resultado.rowCount > 0) {
      return res.status(409).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }
    const atualiza =
      "update usuarios set nome=$1, email=$2, senha=$3 where id = $4";
    const atualizaResultado = await conexao.query(atualiza, [
      nome,
      email,
      senhaCriptograda,
      usuario.id,
    ]);
    return res.status(200).send();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizaUsuario,
};
