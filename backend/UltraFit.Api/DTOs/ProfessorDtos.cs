namespace UltraFit.Api.DTOs;

public record ProfessorCreateDto(string Nome, string Email, string Senha, string? Especialidade, string? Telefone, string? Horario);

public record ProfessorResponseDto(int Id, string Nome, string Email, string? Especialidade, string? Telefone, string? Horario, DateTime DataCadastro);