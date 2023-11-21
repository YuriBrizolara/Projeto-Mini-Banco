const knex = require('knex')({
	client: 'pg',
	connection: {
		user: 'postgres',
		host: 'localhost',
		database: 'dindin',
		password: '230998',
		port: 5432,
	},
})

module.exports = knex