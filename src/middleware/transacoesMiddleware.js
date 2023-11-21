const knex = require('../conexao');
const transacaoId = async (req,res,next) =>{
    const {id}= req.usuario;
    try {
        const transacoes = await knex('transacoes')
            .select('*')
            .where('usuario_id', id);

        req.transacaoId = transacoes;
        next();
    } catch (error) {
        return res.status(400).json({mensagem: 'Erro ao conseguir todas transações do ID'}); 
    }
}
module.exports = transacaoId