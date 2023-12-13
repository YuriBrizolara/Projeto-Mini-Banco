const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        const usuarioEncontrado = await knex('usuarios').where({ id }).first();
        if (!usuarioEncontrado) {
            return res.status(404).json('Usuario não encontrado');
        }
        const { senha, ...usuario } = usuarioEncontrado;
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Usuario não autorizado' });
    }
};

const validarDados = schema => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        
        next();
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message,
        });
    }
};

const perfil = async (req, res) => {
  return res.json(req.usuario);
};

module.exports = {
  criptografarSenha,
  verificarLogin,
  verificarToken,
  validarDados,
  perfil
};