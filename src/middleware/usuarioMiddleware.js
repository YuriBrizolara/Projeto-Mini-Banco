const knex = require('../conexao');
const validator = require("email-validator");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const validarNome = async (req, res, next) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: 'O campo nome é obrigatório' });
  }
  next();
};

const validarEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: 'O campo email é obrigatório' });
  }

  if (!validator.validate(email)) {
    return res.status(400).json({ mensagem: 'E-mail não é válido' });
  }

  try {
    const emailExiste = await knex('usuarios').where({ email }).first();

    if (emailExiste) {
      return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
    }
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao verificar o email', error });
  }

  next();
};

const validarSenha = async (req, res, next) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ mensagem: 'O campo senha é obrigatório' });
  }

  next();
};

const criptografarSenha = async (req, res, next) => {
  const { senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    req.senhaCriptografada = senhaCriptografada;
  } catch (error) {
    return res.status(400).json({ mensagem: 'Erro em criptografar senha', error });
  }

  next();
};

const verificarLogin = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const existe = await knex('usuarios').where({ email }).first();

    if (!existe) {
      return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }

    const { senha: senhaUsuario } = existe;
    const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }
  } catch (error) {
    return res.status(400).json({ mensagem: 'Erro ao verificar o login', error });
  }

  next();
};

const verificarToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.CHAVE_PRIVADA_JWT);
    const usuario = await knex('usuarios').where('id', id).first();

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    req.usuario = usuario;
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido', error });
  }

  next();
};

const perfil = async (req, res) => {
  return res.json(req.usuario);
};

module.exports = {
  criptografarSenha,
  verificarLogin,
  verificarToken,
  validarEmail,
  validarSenha,
  validarNome,
  perfil
};