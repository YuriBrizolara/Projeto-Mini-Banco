const pool = require('../conexao');
const transacaoId = async (req,res,next) =>{
    const {id}= req.usuario;
    try {
        const { rows } = await pool.query(
            'select * from transacoes where usuario_id = $1',
            [id]
        );
        req.transacaoId = rows
        next()
    } catch (error) {
        return res.status(400).json({mensagem: 'Erro ao conseguir todas transações do ID'}); 
    }
}
module.exports = transacaoId