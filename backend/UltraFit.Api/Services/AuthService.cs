using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly IAlunoRepository _alunoRepository;
    private readonly IProfessorRepository _professorRepository;
    private readonly ITokenService _tokenService;

    public AuthService(
        IAlunoRepository alunoRepository,
        IProfessorRepository professorRepository,
        ITokenService tokenService)
    {
        _alunoRepository = alunoRepository;
        _professorRepository = professorRepository;
        _tokenService = tokenService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        // Aluno e Professor são Usuario: o mesmo código trata os dois (polimorfismo).
        Usuario? usuario = await _alunoRepository.GetByEmailAsync(dto.Email);

        if (usuario is null || !usuario.VerificarSenha(dto.Senha))
            usuario = await _professorRepository.GetByEmailAsync(dto.Email);

        if (usuario is null || !usuario.VerificarSenha(dto.Senha))
            return null;

        var token = _tokenService.GerarToken(usuario.Id, usuario.Nome, usuario.Email, usuario.Perfil);
        return new LoginResponseDto(token, usuario.Nome, usuario.Perfil);
    }
}
