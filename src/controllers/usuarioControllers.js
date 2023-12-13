const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const cadastrarUsuario = async (req, res) => {
	const { nome, email } = req.body
	const senhaCriptografada = req.senhaCriptografada
	try {	
		const emailExiste = await knex('usuarios').where({ email }).first();

        if (emailExiste) {
            return res.status(400).json({ mensagem: 'Esse email já existe' });
        }	
        const novoUsuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada,
            })
            .returning(['id', 'nome', 'email']);
		return res.status(201).json(novoUsuario[0]);
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro no cadastro de usuário' })
	};
}
const login = async (req, res) => {
    const { email } = req.body;
	try {
        const loginUsuario = await knex('usuarios').where({ email }).first();
        const { senha, ...usuario } = loginUsuario;
		const token = jwt.sign({ id: usuario.id }, process.env.CHAVE_PRIVADA_JWT, { expiresIn: '8h' });
		return res.status(200).json({
			usuario,
			token,
		});
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao fazer o login' })
	};
};
const atualizarCadastro = async(req, res) => {
	const {nome, email } = req.body;
	const senhaCriptografada = req.senhaCriptografada
	const {id}= req.usuario;
	try {
		await knex('usuarios').where('id', id)
		.update({
			nome, email, senha: senhaCriptografada
		});
		const updatedUser = await knex('usuarios').where('id', id).first();
		if (updatedUser) {
			return res.status(200).json();
		} else {
			return res.status(404).json({ mensagem: 'Registro não encontrado' });
		}
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao fazer ao atualizar cadastro' })
	}
}
module.exports={
    cadastrarUsuario,
	atualizarCadastro,
    login
}