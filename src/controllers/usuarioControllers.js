const pool = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');
const cadastrarUsuario = async (req, res) => {
	const { nome, email } = req.body
	const senhaCriptografada = req.senhaCriptografada
	try {		
        const query = `
            insert into usuarios (nome, email, senha)
            values ($1, $2, $3) returning *
        `

		const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

		const { senha: _, ...usuario } = rows[0];

		return res.status(201).json(usuario);
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro no cadastro de usuário' })
	};
}
const login = async (req, res) => {
    const { email } = req.body;
	try {
        const { rows } = await pool.query(
			'select * from usuarios where email = $1',
			[email]
		);
        const { senha, ...usuario } = rows[0];
		const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });
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
		const query = `
		UPDATE usuarios
		SET nome = $1, email = $2, senha = $3
		WHERE id = $4
		RETURNING *
		`;
		const resultado = await pool.query(query, [nome, email, senhaCriptografada, id]);
		if (resultado.rowCount === 1) {
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