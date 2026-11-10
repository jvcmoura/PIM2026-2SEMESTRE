using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IAlunoService
{
    Task<List<AlunoResponseDto>> GetAllAsync();
    Task<AlunoResponseDto?> GetByIdAsync(int id);
    Task<AlunoResponseDto> CreateAsync(AlunoCreateDto dto);
    Task<AlunoResponseDto?> UpdateAsync(int id, AlunoCreateDto dto);
    Task<bool> DeleteAsync(int id);
}

public class AlunoService : IAlunoService
{
    private readonly IAlunoRepository _repository;

public async Task<AlunoResponseDto?> UpdateAsync(int id, AlunoCreateDto dto)
{
    var aluno = await _repository.GetByIdAsync(id);
    if (aluno is null) return null;

    aluno.Nome = dto.Nome;
    aluno.Email = dto.Email;
    aluno.Telefone = dto.Telefone;
    aluno.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

    await _repository.UpdateAsync(aluno);
    return ToDto(aluno);
}

public async Task<bool> DeleteAsync(int id)
{
    var aluno = await _repository.GetByIdAsync(id);
    if (aluno is null) return false;

    await _repository.DeleteAsync(aluno);
    return true;
}

    public AlunoService(IAlunoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AlunoResponseDto>> GetAllAsync()
    {
        var alunos = await _repository.GetAllAsync();
        return alunos.Select(ToDto).ToList();
    }

    public async Task<AlunoResponseDto?> GetByIdAsync(int id)
    {
        var aluno = await _repository.GetByIdAsync(id);
        return aluno is null ? null : ToDto(aluno);
    }

    public async Task<AlunoResponseDto> CreateAsync(AlunoCreateDto dto)
    {
        var existente = await _repository.GetByEmailAsync(dto.Email);
        if (existente is not null)
            throw new InvalidOperationException("Já existe um aluno cadastrado com esse e-mail.");

        var aluno = new Aluno
        {
            Nome = dto.Nome,
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Telefone = dto.Telefone
        };

        await _repository.AddAsync(aluno);
        return ToDto(aluno);
    }

    private static AlunoResponseDto ToDto(Aluno a) =>
        new(a.Id, a.Nome, a.Email, a.Telefone, a.Status, a.DataCadastro);
}