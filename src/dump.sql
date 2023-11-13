CREATE DATABASE dindin;
CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);
CREATE TABLE categorias (
	id SERIAL PRIMARY KEY,
  descricao text NOT NULL
);
CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
  descricao text NOT NULL,
  valor INT NOT NULL,
  data TEXT NOT NULL,
  categoria_id INT REFERENCES categorias(id) NOT NULL,
  usuario_id INT REFERENCES usuarios(id),
  tipo TEXT NOT NULL
);
INSERT INTO categorias (descricao)
VALUES ('Alimentação'),('Assinaturas e Serviços'),('Casa'),('Mercado'),('Cuidados Pessoais'),
('Educação'),('Família'),('Lazer'),('Pets'),('Presentes'),('Roupas'),('Saúde'),('Transporte'),
('Salário'),('Vendas'),('Outras receitas'),('Outras despesas');