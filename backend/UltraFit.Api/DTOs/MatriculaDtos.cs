namespace UltraFit.Api.DTOs;

public record MatriculaCreateDto(int AlunoId, int PlanoId, DateTime DataInicio);

public record MatriculaResponseDto(int Id, int AlunoId, string NomeAluno, int PlanoId, string NomePlano, DateTime DataInicio, DateTime DataFim, string Status);