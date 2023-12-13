const express = require('express');
const { verificarLogin, verificarToken, criptografarSenha, perfil, validarDados } = require('../middleware/usuarioMiddleware');
const { cadastrarUsuario, login, atualizarCadastro } = require('../controllers/usuarioControllers');
const listarCategoria = require('../controllers/categoriaControllers');
const {listarTransacoes, detalharUmaTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, obterExtrato} = require('../controllers/transacoesControllers');
const transacaoId = require('../middleware/transacoesMiddleware');
const schemaCadastroUsuario = require('../validation/validationUser');
const rotas = express.Router();
rotas.post('/usuario',validarDados(schemaCadastroUsuario),criptografarSenha,cadastrarUsuario);
rotas.post('/login',verificarLogin,login);
rotas.use(verificarToken)
rotas.get('/usuario',perfil);
rotas.put('/usuario',validarDados(schemaCadastroUsuario),criptografarSenha,atualizarCadastro);
rotas.get('/categoria',listarCategoria);
rotas.use(transacaoId)
rotas.get('/transacao',listarTransacoes);
rotas.get('/transacao/extrato',obterExtrato);
rotas.get('/transacao/:id',detalharUmaTransacao);
rotas.post('/transacao',cadastrarTransacao);
rotas.put('/transacao/:id',atualizarTransacao);
rotas.delete('/transacao/:id',deletarTransacao);

module.exports = rotas;