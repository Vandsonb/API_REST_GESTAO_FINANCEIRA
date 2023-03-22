const conexao = require("../config/conexão");

const cadastraTransacao = async (req, res, next) => {
  try {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const usuario = req.usuario;

    if (
      !descricao ||
      !descricao.trim() ||
      !valor ||
      !data ||
      !data.trim() ||
      !categoria_id ||
      !tipo ||
      !tipo.trim()
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }

    const query = "select * from categorias where id = $1";
    const resultado = await conexao.query(query, [categoria_id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(400).json({ mensagem: "Informe um tipo válido." });
    }
    const insert = `insert into transacoes (tipo,descricao,valor,data,usuario_id,categoria_id) values ($1,$2,$3,$4,$5,$6) returning *`;
    const resultadoDoInsert = await conexao.query(insert, [
      tipo,
      descricao,
      valor,
      data,
      usuario.id,
      categoria_id,
    ]);

    return res.status(200).json(resultadoDoInsert.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const listaTransacao = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    const { filtro } = req.query;

    const query = `select transacoes.*, categorias.descricao as categoria_nome 
    from transacoes
    join categorias
    on transacoes.categoria_id = categorias.id 
    where transacoes.usuario_id = $1 order by transacoes desc`;
    const resultado = await conexao.query(query, [usuario.id]);

    if (filtro && !Array.isArray(filtro)) {
      return res
        .status(400)
        .json({ mensagem: "O filtro solicitado precisa ser um array" });
    }

    if (filtro && filtro[0] !== "") {
      const result = resultado.rows.filter((transacao) =>
        filtro.includes(transacao.categoria_nome)
      );
      return res.status(200).json(result);
    } else {
      return res.status(200).json(resultado.rows);
    }
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const detalhaTransacao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    const query = `select transacoes.* , categorias.descricao as categoria_nome 
    from transacoes
    join categorias
    on transacoes.categoria_id = categorias.id 
    where transacoes.usuario_id = $1 and transacoes.id = $2`;
    const resultado = await conexao.query(query, [usuario.id, id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }
    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const atualizaTransacao = async (req, res, next) => {
  try {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.params;
    const usuario = req.usuario;

    if (
      !descricao ||
      !descricao.trim() ||
      !valor ||
      !data ||
      !data.trim() ||
      !categoria_id ||
      !tipo ||
      !tipo.trim()
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(400)
        .json({ mensagem: `informe se o tipo é 'entrada' ou 'saida'.` });
    }

    const queryValidaCategoria = `select * from categorias where id = $1`;
    const resultadoValidaCategoria = await conexao.query(queryValidaCategoria, [
      categoria_id,
    ]);
    if (resultadoValidaCategoria.rowCount === 0) {
      return res.status(404).json({ mensagem: "Categoria não existe." });
    }

    const queryValidaTransacaoExistente = `
    select transacoes.descricao, transacoes.valor, transacoes.data, transacoes.categoria_id, categorias.descricao
    from transacoes
    join categorias
    on transacoes.categoria_id = categorias.id where transacoes.usuario_id = $1 and transacoes.id = $2
    `;
    const resultadoValidaTransacaoExistente = await conexao.query(
      queryValidaTransacaoExistente,
      [usuario.id, id]
    );
    if (resultadoValidaTransacaoExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    const queryAtualiza = `update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6`;
    await conexao.query(queryAtualiza, [
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      id,
    ]);

    return res.status(200).send();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const deletaTransacao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    const query = `select * from transacoes where id = $1 and usuario_id = $2`;
    const resultado = await conexao.query(query, [id, usuario.id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }
    const queryDeleta = `delete from transacoes where id = $1`;
    await conexao.query(queryDeleta, [id]);
    return res.status(200).send();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const obterExtratoDaTransacao = async (req, res, next) => {
  try {
    const usuario = req.usuario;

    const query = `select usuario_id,tipo,valor from transacoes where usuario_id = $1`;
    const resultado = await conexao.query(query, [usuario.id]);

    const montanteTransacoes = resultado.rows.reduce(
      (acumulador, transacao) => {
        acumulador[transacao.tipo] += transacao.valor;
        return acumulador;
      },
      {
        entrada: 0,
        saida: 0,
      }
    );

    return res.status(200).json(montanteTransacoes);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  cadastraTransacao,
  listaTransacao,
  detalhaTransacao,
  atualizaTransacao,
  deletaTransacao,
  obterExtratoDaTransacao,
};
