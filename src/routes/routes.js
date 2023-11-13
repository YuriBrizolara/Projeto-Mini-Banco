const express = require('express');
const { validarNome, validarEmail, validarSenha, verificarLogin, verificarToken, criptografarSenha, perfil } = require('../middleware/usuarioMiddleware');
const { cadastrarUsuario, login, atualizarCadastro } = require('../controllers/usuarioControllers');
const listarCategoria = require('../controllers/categoriaControllers');
const {listarTransacoes, detalharUmaTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, obterExtrato} = require('../controllers/transacoesControllers');
const transacaoId = require('../middleware/transacoesMiddleware');
const rotas = express.Router();
rotas.post('/usuario',validarNome,validarEmail,validarSenha,criptografarSenha,cadastrarUsuario);
rotas.post('/login',verificarLogin,login);
rotas.use(verificarToken)
rotas.get('/usuario',perfil);
rotas.put('/usuario',validarNome,validarEmail,validarSenha,criptografarSenha,atualizarCadastro);
rotas.get('/categoria',listarCategoria);
rotas.use(transacaoId)
rotas.get('/transacao',listarTransacoes);
rotas.get('/transacao/extrato',obterExtrato);
rotas.get('/transacao/:id',detalharUmaTransacao);
rotas.post('/transacao',cadastrarTransacao);
rotas.put('/transacao/:id',atualizarTransacao);
rotas.delete('/transacao/:id',deletarTransacao);

module.exports = rotas;