const knex = require('../conexao')

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {

        if (categoria) {
            const buscarCategoria = await knex('produtos')
                .where('usuario_id', usuario.id).whereILike('categoria', `%${categoria}%`).first()

            return res.json(buscarCategoria)
        }

        const produtos = await knex('produtos').where('usuario_id', usuario.id)

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const obter = await knex('produtos').where({ usuario_id: usuario.id, id: id }).first()

        if (!obter) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(obter);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {

        const produto = await knex('produtos')
            .insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem })


        if (produto.rowCount === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const obter = await knex('produtos').where({ usuario_id: usuario.id, id: id }).first()

        if (!obter) {
            return res.status(404).json('Produto não encontrado');
        }

        const atualizar = await knex('produtos')
            .update({ nome, estoque, preco, categoria, descricao, imagem })
            .where({ usuario_id: usuario.id, id: id })

        if (!atualizar) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('O produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const obter = await knex('produtos').where({ usuario_id: usuario.id, id: id }).first()

        if (!obter) {
            return res.status(404).json('Produto não encontrado');
        }

        const excluir = await knex('produtos').del().where('id', id)

        if (!excluir) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}