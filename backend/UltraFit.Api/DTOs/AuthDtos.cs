namespace UltraFit.Api.DTOs;

public record LoginDto(string Email, string Senha);

public record LoginResponseDto(string Token, string Nome, string Perfil);