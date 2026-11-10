namespace UltraFit.Api.DTOs;

public record PlanoCreateDto(string NomePlano, decimal Valor, int DuracaoMeses);

public record PlanoResponseDto(int Id, string NomePlano, decimal Valor, int DuracaoMeses, bool Ativo);