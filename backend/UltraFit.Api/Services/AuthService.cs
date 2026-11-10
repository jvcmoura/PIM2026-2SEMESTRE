using UltraFit.Api.DTOs;
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
        var aluno = await _alunoRepository.GetByEmailAsync(dto.Email);
        if (aluno is not null && SenhaConfere(dto.Senha, aluno.SenhaHash))
        {
            var token = _tokenService.GerarToken(aluno.Id, aluno.Nome, aluno.Email, "Aluno");
            return new LoginResponseDto(token, aluno.Nome, "Aluno");
        }

        var professor = await _professorRepository.GetByEmailAsync(dto.Email);
        if (professor is not null && SenhaConfere(dto.Senha, professor.SenhaHash))
        {
            var token = _tokenService.GerarToken(professor.Id, professor.Nome, professor.Email, "Professor");
            return new LoginResponseDto(token, professor.Nome, "Professor");
        }

        return null;
    }

    // Os usuários do seed têm o texto "HASH_AQUI" no lugar do hash.
    // Sem esse try/catch, o BCrypt estoura exceção (erro 500) em vez de recusar o login.
    private static bool SenhaConfere(string senha, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(senha, hash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false;
        }
    }
}