using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IMatriculaService
{
    Task<List<MatriculaResponseDto>> GetAllAsync();
    Task<MatriculaResponseDto?> GetByIdAsync(int id);
    Task<MatriculaResponseDto> CreateAsync(MatriculaCreateDto dto);
    Task<bool> DeleteAsync(int id);

    Task<List<MatriculaResponseDto>> GetByAlunoAsync(int alunoId);
}

public class MatriculaService : IMatriculaService
{
    private readonly IMatriculaRepository _repository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IPlanoRepository _planoRepository;

    public MatriculaService(
        IMatriculaRepository repository,
        IAlunoRepository alunoRepository,
        IPlanoRepository planoRepository)
    {
        _repository = repository;
        _alunoRepository = alunoRepository;
        _planoRepository = planoRepository;
    }

    public async Task<List<MatriculaResponseDto>> GetAllAsync()
    {
        var matriculas = await _repository.GetAllAsync();
        var resultado = new List<MatriculaResponseDto>();

        foreach (var m in matriculas)
            resultado.Add(await ToDtoAsync(m));

        return resultado;
    }

    public async Task<MatriculaResponseDto?> GetByIdAsync(int id)
    {
        var matricula = await _repository.GetByIdAsync(id);
        return matricula is null ? null : await ToDtoAsync(matricula);
    }

    public async Task<MatriculaResponseDto> CreateAsync(MatriculaCreateDto dto)
    {
        var aluno = await _alunoRepository.GetByIdAsync(dto.AlunoId)
            ?? throw new InvalidOperationException("Aluno não encontrado.");

        var plano = await _planoRepository.GetByIdAsync(dto.PlanoId)
            ?? throw new InvalidOperationException("Plano não encontrado.");

        var matricula = new Matricula
        {
            AlunoId = dto.AlunoId,
            PlanoId = dto.PlanoId,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataInicio.AddMonths(plano.DuracaoMeses),
            Status = "Ativa"
        };

        await _repository.AddAsync(matricula);
        return await ToDtoAsync(matricula);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var matricula = await _repository.GetByIdAsync(id);
        if (matricula is null) return false;

        await _repository.DeleteAsync(matricula);
        return true;
    }

    private async Task<MatriculaResponseDto> ToDtoAsync(Matricula m)
    {
        var aluno = await _alunoRepository.GetByIdAsync(m.AlunoId);
        var plano = await _planoRepository.GetByIdAsync(m.PlanoId);

        return new MatriculaResponseDto(
            m.Id, m.AlunoId, aluno?.Nome ?? "Desconhecido",
            m.PlanoId, plano?.NomePlano ?? "Desconhecido",
            m.DataInicio, m.DataFim, m.Status
        );
    }
    public async Task<List<MatriculaResponseDto>> GetByAlunoAsync(int alunoId)
{
    var matriculas = await _repository.GetByAlunoIdAsync(alunoId);
    var resultado = new List<MatriculaResponseDto>();

    foreach (var m in matriculas)
        resultado.Add(await ToDtoAsync(m));

    return resultado;
}
}