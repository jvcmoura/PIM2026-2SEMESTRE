-- =========================================================
-- ULTRA FIT ACADEMIA - Script de Banco de Dados (SQL Server)
-- PIM IV - Migração de MongoDB para banco relacional
-- =========================================================

CREATE DATABASE UltraFitDB;
GO

USE UltraFitDB;
GO

-- =========================================================
-- TABELAS
-- =========================================================

CREATE TABLE Planos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NomePlano NVARCHAR(100) NOT NULL,
    Valor DECIMAL(10,2) NOT NULL,
    DuracaoMeses INT NOT NULL,
    Ativo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Professores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(255) NOT NULL,
    Especialidade NVARCHAR(100) NULL,
    Telefone NVARCHAR(20) NULL,
    Horario NVARCHAR(100) NULL,
    DataCadastro DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Alunos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(255) NOT NULL,
    Telefone NVARCHAR(20) NULL,
    DataCadastro DATETIME NOT NULL DEFAULT GETDATE(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Ativo' -- Ativo, Inativo, Inadimplente
);
GO

CREATE TABLE Matriculas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AlunoId INT NOT NULL,
    PlanoId INT NOT NULL,
    DataInicio DATE NOT NULL,
    DataFim DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Ativa', -- Ativa, Encerrada, Cancelada
    CONSTRAINT FK_Matriculas_Alunos FOREIGN KEY (AlunoId) REFERENCES Alunos(Id),
    CONSTRAINT FK_Matriculas_Planos FOREIGN KEY (PlanoId) REFERENCES Planos(Id)
);
GO

CREATE TABLE Pagamentos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AlunoId INT NOT NULL,
    MatriculaId INT NOT NULL,
    Valor DECIMAL(10,2) NOT NULL,
    DataVencimento DATE NOT NULL,
    DataPagamento DATE NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pendente', -- Pendente, Pago, Atrasado
    CONSTRAINT FK_Pagamentos_Alunos FOREIGN KEY (AlunoId) REFERENCES Alunos(Id),
    CONSTRAINT FK_Pagamentos_Matriculas FOREIGN KEY (MatriculaId) REFERENCES Matriculas(Id)
);
GO

CREATE TABLE AvaliacoesFisicas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AlunoId INT NOT NULL,
    Peso DECIMAL(5,2) NOT NULL,
    Altura DECIMAL(4,2) NOT NULL,
    IMC AS (Peso / (Altura * Altura)) PERSISTED,
    DataAvaliacao DATE NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Avaliacoes_Alunos FOREIGN KEY (AlunoId) REFERENCES Alunos(Id)
);
GO

CREATE TABLE Checkins (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AlunoId INT NOT NULL,
    DataHora DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Checkins_Alunos FOREIGN KEY (AlunoId) REFERENCES Alunos(Id)
);
GO

-- =========================================================
-- PROCEDURES
-- =========================================================

-- Registra um pagamento e reflete o status na matrícula
CREATE PROCEDURE sp_RegistrarPagamento
    @PagamentoId INT,
    @DataPagamento DATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Pagamentos
    SET DataPagamento = @DataPagamento,
        Status = 'Pago'
    WHERE Id = @PagamentoId;

    -- Se o aluno não tiver mais pagamentos em atraso, volta o status para Ativo
    DECLARE @AlunoId INT;
    SELECT @AlunoId = AlunoId FROM Pagamentos WHERE Id = @PagamentoId;

    IF NOT EXISTS (
        SELECT 1 FROM Pagamentos
        WHERE AlunoId = @AlunoId AND Status = 'Atrasado'
    )
    BEGIN
        UPDATE Alunos SET Status = 'Ativo' WHERE Id = @AlunoId;
    END
END
GO

-- Retorna a lista de alunos inadimplentes com o valor em atraso
CREATE PROCEDURE sp_CalcularInadimplencia
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        a.Id AS AlunoId,
        a.Nome,
        a.Email,
        SUM(p.Valor) AS TotalEmAtraso,
        COUNT(p.Id) AS QuantidadeParcelasAtrasadas
    FROM Alunos a
    INNER JOIN Pagamentos p ON p.AlunoId = a.Id
    WHERE p.Status = 'Atrasado'
    GROUP BY a.Id, a.Nome, a.Email
    ORDER BY TotalEmAtraso DESC;
END
GO

-- =========================================================
-- TRIGGER
-- =========================================================

-- Marca pagamentos vencidos como "Atrasado" e o aluno como "Inadimplente"
-- Disparado sempre que um pagamento é inserido ou atualizado
CREATE TRIGGER trg_MarcarInadimplencia
ON Pagamentos
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.Status = 'Atrasado'
    FROM Pagamentos p
    INNER JOIN inserted i ON p.Id = i.Id
    WHERE i.DataPagamento IS NULL
      AND i.DataVencimento < CAST(GETDATE() AS DATE)
      AND i.Status <> 'Pago';

    UPDATE a
    SET a.Status = 'Inadimplente'
    FROM Alunos a
    INNER JOIN inserted i ON a.Id = i.AlunoId
    WHERE i.DataPagamento IS NULL
      AND i.DataVencimento < CAST(GETDATE() AS DATE)
      AND i.Status <> 'Pago';
END
GO

-- =========================================================
-- SEED DE DADOS DE TESTE
-- =========================================================

INSERT INTO Planos (NomePlano, Valor, DuracaoMeses) VALUES
('Mensal Básico', 99.90, 1),
('Trimestral', 269.90, 3),
('Anual', 899.90, 12);
GO

INSERT INTO Professores (Nome, Email, SenhaHash, Especialidade, Telefone, Horario) VALUES
('Carlos Mendes', 'carlos.mendes@ultrafit.com', 'HASH_AQUI', 'Musculação', '11999990001', '06:00-14:00'),
('Fernanda Lima', 'fernanda.lima@ultrafit.com', 'HASH_AQUI', 'Funcional', '11999990002', '14:00-22:00');
GO

INSERT INTO Alunos (Nome, Email, SenhaHash, Telefone) VALUES
('Ana Souza', 'ana.souza@email.com', 'HASH_AQUI', '11988880001'),
('Bruno Alves', 'bruno.alves@email.com', 'HASH_AQUI', '11988880002');
GO

INSERT INTO Matriculas (AlunoId, PlanoId, DataInicio, DataFim) VALUES
(1, 1, '2026-08-01', '2026-09-01'),
(2, 2, '2026-07-01', '2026-10-01');
GO

INSERT INTO Pagamentos (AlunoId, MatriculaId, Valor, DataVencimento) VALUES
(1, 1, 99.90, '2026-09-05'),
(2, 2, 269.90, '2026-08-01'); -- este vai disparar a trigger de inadimplência (vencido)
GO
