const joi = require('joi');
const schemaCadastroUsuario = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.base': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório',
    }),

    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'string.base': 'O campo email é obrigatório',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
    }),

    senha: joi.string().min(6).required().messages({
        'any.required': 'O campo senha é obrigatório',
        'string.base': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha é obrigatório',
        'string.min': 'A senha precisa conter, no mínimo, 6 caracteres',
    }),
});

module.exports = schemaCadastroUsuario;