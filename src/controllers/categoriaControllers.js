const pool = require('../conexao');
const listarCategoria = async (req,res) =>{
    try {
        const {rows} = await pool.query('select * from categorias');
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(400).json({mensagem: 'Erro ao listar as categorias'})
    }

}
module.exports = listarCategoria