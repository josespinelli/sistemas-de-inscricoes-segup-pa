-- ===========================================================
-- Schema do Sistema de Inscrições — SEGUP/PA
-- ===========================================================
-- Pré-requisito: o banco de dados já deve existir.
-- Com a propriedade createDatabaseIfNotExist=true na URL JDBC,
-- o próprio conector MySQL cria o banco se necessário.
-- ===========================================================

CREATE TABLE IF NOT EXISTS inscricoes (
    id               BIGINT          NOT NULL AUTO_INCREMENT,
    protocolo        VARCHAR(20)     NOT NULL,
    nome_completo    VARCHAR(255)    NOT NULL,
    cpf              VARCHAR(14)     NOT NULL,
    email            VARCHAR(255)    NOT NULL,
    telefone         VARCHAR(20)     NOT NULL,
    servico          VARCHAR(255)    NOT NULL,
    observacao       TEXT,
    status           VARCHAR(20)     NOT NULL DEFAULT 'CONFIRMADA',
    data_criacao     DATETIME        NOT NULL,
    data_atualizacao DATETIME,

    PRIMARY KEY (id),
    UNIQUE KEY uq_protocolo (protocolo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
