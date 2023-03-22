# API-Rest Gestão Financeira

Projeto desenvolvido para o desafio do 3º Módulo do curso com foco em Back-end da Cubos Academy.

O objetivo (alcançado com sucesso) era criar e desenvolver uma API para um gestor de finanças.

Construi uma RESTful API que permite:

- Cadastrar Usuário
- Fazer Login
- Detalhar Perfil do Usuário Logado
- Editar Perfil do Usuário Logado
- Listar categorias
- Listar transações
- Detalhar transação
- Cadastrar transação
- Editar transação
- Remover transação
- Obter extrato de transações
- Filtrar transações por categoria

## **Banco de dados**

(o código para esta implementação está no arquivo "dump.sql")

Você precisa criar um Banco de Dados PostgreSQL chamado `dindin` contendo as seguintes tabelas e colunas:  
**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

- usuarios
  - id
  - nome
  - email (campo único)
  - senha
- categorias
  - id
  - descricao
- transacoes
  - id
  - descricao
  - valor
  - data
  - categoria_id
  - usuario_id
  - tipo

**IMPORTANTE: Deverá ser criado no projeto o(s) arquivo(s) SQL que deverá ser o script que cria as tabelas corretamente.**

As categorias a seguir precisam ser previamente cadastradas para que sejam listadas no endpoint de listagem das categorias.

## **Categorias**

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas

**IMPORTANTE: Deverá ser criado no projeto o arquivo SQL que deverá ser o script de inserção das categorias acima na tabela.**

## **Infos importantes**

- A API acessa o banco de dados a ser criado "dindin" para persistir e manipular os dados de usuários, categorias e transações utilizados pela aplicação.
- O campo `id` das tabelas no banco de dados são de auto incremento, chave primária e não permite edição uma vez criado.
- Qualquer valor monetário está representado em centavos (Ex.: R$ 10,00 reais = 1000)

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) possui um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, envia no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo `id` e excluindo a senha criptografada.
  Em caso de **falha na validação**, a resposta possuir **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **Este Endpoint:**
  - Valida os campos obrigatórios:
    - nome
    - email
    - senha
  - Valida se o e-mail informado já existe
  - Criptografa a senha antes de persistir no banco de dados
  - Cadastra o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) possui um objeto com as seguintes propriedades (respeitando estes nomes):

  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto com a propriedade **token** que possui como valor o token de autenticação gerado e uma propriedade **usuario** que possui as informações do usuário autenticado, exceto a senha do usuário.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **Este Endpoint:**

  - Valida os campos obrigatórios:
    - email
    - senha
  - Verifica se o e-mail existe
  - Valida e-mail e senha
  - Cria token de autenticação com id do usuário

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigirão o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

---

### **Validações do token**

- **Esta parte:**
  - Valida se o token foi enviado no header da requisição (Bearer Token)
  - Verifica se o token é válido
  - Consulta usuário no banco de dados pelo id contido no token informado

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário será identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não possui conteúdo no corpo da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário será identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) possui um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, não será enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) irá possuir um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**
  - Valida os campos obrigatórios:
    - nome
    - email
    - senha
  - Valida se o novo e-mail já existe no banco de dados para outro usuário
    - Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não deve ser permitida (o campo de email deve ser sempre único no banco de dados)
  - Criptografa a senha antes de salvar no banco de dados
  - Atualiza as informações do usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar categorias**

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não possui conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possuirá um array dos objetos (categorias) encontrados.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Este endpoint:**
  - O endpoint deverá responder com um array de todas as categorias cadastradas.

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
  {
    id: 1,
    descricao: "Roupas",
  },
  {
    id: 2,
    descricao: "Mercado",
  },
];
```

```javascript
// HTTP Status 200 / 201 / 204
[];
```

### **Listar transações do usuário logado**

#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  
**Lembre-se:** serão retornadas **apenas** transações associadas ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não possui conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possuirá um array dos objetos (transações) encontrados.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**
  - O usuário será identificado através do ID presente no token de validação
  - O endpoint responderá com um array de todas as transações associadas ao usuário. Caso não exista nenhuma transação associada ao usuário responderá com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```

```javascript
// HTTP Status 200 / 201 / 204
[];
```

### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  
**Lembre-se:** Será retornado **apenas** transação associada ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possuirá um objeto que representa a transação encontrada, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.

#### **Exemplo de requisição**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  
**Lembre-se:** Será possível cadastrar **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**
  Em caso de **sucesso**, será enviado, no corpo (body) da resposta, as informações da transação cadastrada, incluindo seu respectivo `id`.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**
  - Valida os campos obrigatórios:
    - descricao
    - valor
    - data
    - categoria_id
    - tipo
  - Valida se existe categoria para o id enviado no corpo (body) da requisição.
  - Valida se o tipo enviado no corpo (body) da requisição corresponde a palavra `entrada` ou `saida`, exatamente como descrito.
  - Cadastra a transação associada ao usuário logado.

#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  
**Lembre-se:** será possível atualizar **apenas** transações associadas ao próprio usuário logado, que deverá será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**  
  Em caso de **sucesso**, não será enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Valida os campos obrigatórios:
    - descricao
    - valor
    - data
    - categoria_id
    - tipo
  - Valida se existe categoria para o id enviado no corpo (body) da requisição.
  - Valida se o tipo enviado no corpo (body) da requisição corresponde a palavra `entrada` ou `saida`, exatamente como descrito.
  - Atualiza a transação no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  
**Lembre-se:**Será possível excluir **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, não será enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Esta parte:**:
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Exclui a transação no banco de dados.

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.
**Lembre-se:**Será possível consultar **apenas** transações associadas ao próprio usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, será enviado no corpo (body) da resposta um objeto contendo a soma de todas as transações do tipo `entrada` e a soma de todas as transações do tipo `saida`.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **infos:**:
  - Em caso de não existir transações do tipo `entrada` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta será 0.
  - Em caso de não existir transações do tipo `saida` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta será 0.

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"entrada": 300000,
	"saida": 15800
}
```

---

### **Filtrar transações por categoria**

Na funcionalidade de listagem de transações do usuário logado (**GET /transacao**), foi incluido um parâmetro do tipo query **filtro** para que seja possível consultar apenas transações das categorias informadas.

**Lembre-se:**Serão retornadas **apenas** transações associadas ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Parâmetro opcional do tipo query **filtro**.
  Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possuirá um array dos objetos (transações) encontradas.  
  Em caso de **falha na validação**, a resposta possuirá **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

- **Infos:**
  - O usuário será identificado através do ID presente no token de validação
  - O parâmetro opcional do tipo query **filtro**, quando enviado, será sempre um array contendo a descrição de uma ou mais categorias.
  - O endpoint responderá com um array de todas as transações associadas ao usuário que sejam da categorias passadas no parâmetro query. Caso não exista nenhuma transação associada ao usuário responderá com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```

```javascript
// HTTP Status 200 / 201 / 204
[];
```

---
