const pool = require('../conexao');
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');
const validarNome = async (req, res,next) => {
	const { nome } = req.body

	if (!nome) {
		return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
	}
	next()
}
const validarEmail = async (req, res,next) => {
	const { email } = req.body

	if (!email) {
		return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
	}
	if(validator.validate(email)===false ){
		return res.status(400).json({ mensagem: 'E-mail não é valido' });
	}
	try {
		const emailExiste = await pool.query(
			'select * from usuarios where email = $1',
			[email]
		)
	
		if (emailExiste.rowCount > 0) {
			return res.status(400).json({ mensagem: ' Já existe usuário cadastrado com o e-mail informado.' })
		}
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao verificar o email' })
	}
	
	next()
}
const validarSenha = async (req, res, next) => {
	const { senha } = req.body

	if (!senha) {
		return res.status(400).json({ mensagem: 'O campo senha é obrigatório' })
	}
	next()
}
const criptografarSenha = async (req, res, next) =>{
	const { senha } = req.body;
	try {
		const senhaCriptografada = await bcrypt.hash(senha, 10);
		req.senhaCriptografada=senhaCriptografada
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro em criptografar senha' })
	}
	next()
	
}
const verificarLogin = async (req, res, next) =>{
	const { email, senha } = req.body;
	try {
		const { rows, rowCount } = await pool.query(
			'select * from usuarios where email = $1',
			[email]
		);
	
		if (rowCount === 0) {
			return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
		};
	
		const { senha: senhaUsuario } = rows[0];
	
		const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);
	
		if (!senhaCorreta) {
			return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
		};
		
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro ao verificar o login' })
	}
	next();
}
const verificarToken = async (req, res, next) =>{
	const  { authorization }  = req.headers;
	if (!authorization) {
		return res.status(401).json({mensagem: 'Token inválido'})
	}
	const token= authorization.split(' ')[1]
	try {
		const {id} = jwt.verify(token,senhaJwt);
		const {rows,rowCount} = await pool.query('SELECT id,nome,email FROM usuarios WHERE id=$1',[id])
		if (rowCount<1) {
			return res.status(404).json({mensagem: 'Usuario não encontrado'})
		}
		req.usuario= rows[0]
	} catch (error) {
		return res.status(401).json({mensagem: 'Token inválido 2'})
	}
	next();
}
const perfil = async (req, res, next) =>{
	return res.json(req.usuario)
}
module.exports={
	criptografarSenha,
	verificarLogin,
	verificarToken, 
	validarEmail,
	validarSenha,
	validarNome,
	perfil
}