namespace UltraFit.Api.DTOs;

// O que a API recebe para CRIAR um aluno
public record AlunoCreateDto(string Nome, string Email, string Senha, string? Telefone);

// O que a API devolve quando alguém CONSULTA um aluno
//record é um tipo especial do C# pra classes que só carregam dados (mais enxuto que escrever uma class com todos os get; set;)
public record AlunoResponseDto(int Id, string Nome, string Email, string? Telefone, string Status, DateTime DataCadastro);