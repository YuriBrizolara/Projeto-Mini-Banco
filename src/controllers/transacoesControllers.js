const pool = require('../conexao');
const listarTransacoes = async (req,res) => {
    const transacao = req.transacaoId
    try {
        return res.status(200).json(transacao)
    } catch (error) {
        return res.status(400).json({mensagem: 'Erro ao listar as trasações'}); 
    }
};
const detalharUmaTransacao = async (req,res) => {
    const {id} = req.params;
    const usuario_id = req.usuario.id;
    try {
        const {rows} = await pool.query(
			'select * from transacoes WHERE id = $1 AND usuario_id = $2 ',
			[id, usuario_id]
		);
        return res.status(200).json(rows[0]); 
    } catch (error) {
        return res.status(400).json({mensagem: 'Transação não encontrada.'}); 
    }
};
const cadastrarTransacao = async (req,res) =>{
    const {descricao, valor, data, categoria_id, tipo} = req.body
    const usuario_id = req.usuario.id;
    try {
        const query = `
            INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
            values ($1, $2, $3, $4, $5, $6) returning *
        `
        const { rows } = await pool.query(query, [descricao, valor, data, categoria_id, usuario_id, tipo]);
		return res.status(201).json(rows);
    } catch (error) {
        return res.status(400).json({mensagem: 'Todos os campos obrigatórios devem ser informados.'}); 
    }
};
const atualizarTransacao = async (req, res) =>{
    const {id} = req.params;
    const {descricao, valor, data, categoria_id, tipo} = req.body
    const usuario_id = req.usuario.id;
    try {
        const query = `
            UPDATE transacoes 
            SET descricao = $1, valor = $2, data = $3, categoria_id = $4, usuario_id = $5, tipo = $6 WHERE id = $7 AND usuario_id = $8
            returning *
        `
        const { rows } = await pool.query(query, [descricao, valor, data, categoria_id, usuario_id, tipo, id, usuario_id]);
		return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(400).json({mensagem: 'Todos os campos obrigatórios devem ser informados.'}); 
    }
};
const deletarTransacao = async (req,res) =>{
    const {id} = req.params;
    const usuario_id = req.usuario.id;
    try {
        const query = `
        DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2
        `
        const deletar = await pool.query(query,[id, usuario_id]);
        console.log(deletar);
        if(rowCount===0) {
            return res.status(400).json({mensagem:'Transação não encontrada.'})
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({mensagem:'Erro em deletar transação.'})
    }
};
const obterExtrato = async (req,res) =>{
    const {id} = req.usuario
    try {
        const query = `
        SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS entrada,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saida
        FROM transacoes
        WHERE usuario_id = $1;
        `;
        const  {rows}  = await pool.query(query,[id]);
        return res.status(200).json(rows[0])
    } catch (error) {
        return res.status(400).json({mensagem:'Erro no extrato'})
    }
};
module.exports = {
    listarTransacoes,
    detalharUmaTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtrato
}