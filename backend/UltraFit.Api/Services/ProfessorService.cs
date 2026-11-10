using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IProfessorService
{
    Task<List<ProfessorResponseDto>> GetAllAsync();
    Task<ProfessorResponseDto?> GetByIdAsync(int id);
    Task<ProfessorResponseDto> CreateAsync(ProfessorCreateDto dto);
    Task<ProfessorResponseDto?> UpdateAsync(int id, ProfessorCreateDto dto);
    Task<bool> DeleteAsync(int id);
}

public class ProfessorService : IProfessorService
{
    private readonly IProfessorRepository _repository;

    public ProfessorService(IProfessorRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProfessorResponseDto>> GetAllAsync()
    {
        var professores = await _repository.GetAllAsync();
        return professores.Select(ToDto).ToList();
    }

    public async Task<ProfessorResponseDto?> GetByIdAsync(int id)
    {
        var professor = await _repository.GetByIdAsync(id);
        return professor is null ? null : ToDto(professor);
    }

    public async Task<ProfessorResponseDto> CreateAsync(ProfessorCreateDto dto)
    {
        var existente = await _repository.GetByEmailAsync(dto.Email);
        if (existente is not null)
            throw new InvalidOperationException("Já existe um professor cadastrado com esse e-mail.");

        var professor = new Professor
        {
            Nome = dto.Nome,
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Especialidade = dto.Especialidade,
            Telefone = dto.Telefone,
            Horario = dto.Horario
        };

        await _repository.AddAsync(professor);
        return ToDto(professor);
    }

    public async Task<ProfessorResponseDto?> UpdateAsync(int id, ProfessorCreateDto dto)
    {
        var professor = await _repository.GetByIdAsync(id);
        if (professor is null) return null;

        professor.Nome = dto.Nome;
        professor.Email = dto.Email;
        professor.Especialidade = dto.Especialidade;
        professor.Telefone = dto.Telefone;
        professor.Horario = dto.Horario;
        professor.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        await _repository.UpdateAsync(professor);
        return ToDto(professor);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var professor = await _repository.GetByIdAsync(id);
        if (professor is null) return false;

        await _repository.DeleteAsync(professor);
        return true;
    }

    private static ProfessorResponseDto ToDto(Professor p) =>
        new(p.Id, p.Nome, p.Email, p.Especialidade, p.Telefone, p.Horario, p.DataCadastro);
}