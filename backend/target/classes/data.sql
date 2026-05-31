-- ===========================================================
-- Dados de exemplo — SEGUP/PA
-- INSERT IGNORE ignora registros duplicados em reinicializações
-- ===========================================================

INSERT IGNORE INTO inscricoes
    (protocolo, nome_completo, cpf, email, telefone, servico, observacao, status, data_criacao, data_atualizacao)
VALUES
    (
        'INS-20260101-0001',
        'João da Silva Santos',
        '123.456.789-00',
        'joao.silva@email.com',
        '(91) 98765-4321',
        'Curso de Segurança Pública',
        NULL,
        'CONFIRMADA',
        '2026-01-01 09:00:00',
        '2026-01-01 09:00:00'
    ),
    (
        'INS-20260101-0002',
        'Maria Aparecida Ferreira',
        '987.654.321-00',
        'maria.ferreira@email.com',
        '(91) 91234-5678',
        'Seminário de Inteligência Policial',
        'Interesse em participar como ouvinte',
        'CONFIRMADA',
        '2026-01-01 10:30:00',
        '2026-01-01 10:30:00'
    ),
    (
        'INS-20260102-0001',
        'Carlos Eduardo Nascimento',
        '456.789.123-00',
        'carlos.nascimento@email.com',
        '(91) 99876-5432',
        'Curso de Primeiros Socorros Táticos',
        NULL,
        'CANCELADA',
        '2026-01-02 14:00:00',
        '2026-01-03 08:00:00'
    );
