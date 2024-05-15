CREATE DATABASE sosit;

DROP TABLE usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha LONGTEXT,
    perfil VARCHAR(50),
    ativo BOOLEAN
);

DROP TABLE agendas;
CREATE TABLE agendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nome VARCHAR(100),
    servico VARCHAR(100),
    descricao TEXT,
    ativo BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

DROP TABLE dia_semana;
CREATE TABLE dia_semana (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50)
);

DROP TABLE horarios;
CREATE TABLE horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_dia INT,
    id_agenda INT,
    inicio TIME,
    fim TIME,
    ativo BOOLEAN,
    FOREIGN KEY (id_dia) REFERENCES dia_semana(id),
    FOREIGN KEY (id_agenda) REFERENCES agendas(id)
);

DROP TABLE avaliacoes;
CREATE TABLE avaliacoes (
	id INT AUTO_INCREMENT PRIMARY KEY,
    numero FLOAT
);

DROP TABLE compromissos;
CREATE TABLE compromissos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_horario INT,
    id_avaliacao INT,
    dt_completa DATETIME,
    descricao TEXT,
    ativo BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_horario) REFERENCES horarios(id),
	FOREIGN KEY (id_avaliacao) REFERENCES avaliacoes(id)
);

DROP TABLE dados_usuario;
CREATE TABLE dados_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
	contato VARCHAR(50),
	nascimento DATE,
    num_cadastro INT,
    cep INT,
    num_residencia INT,
    rua VARCHAR(50),
    bairro VARCHAR(25),
    cidade VARCHAR(25),
    estado CHAR(2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);