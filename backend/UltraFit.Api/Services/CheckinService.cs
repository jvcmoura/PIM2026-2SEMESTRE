using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface ICheckinService
{
    Task<CheckinResponseDto> RegistrarAsync(int alunoId);
    Task<List<CheckinResponseDto>> GetAllAsync();
    Task<List<CheckinResponseDto>> GetByAlunoIdAsync(int alunoId);
}

public class CheckinService : ICheckinService
{
    private readonly ICheckinRepository _repo;
    private readonly IAlunoRepository _alunoRepo;

    public CheckinService(ICheckinRepository repo, IAlunoRepository alunoRepo)
    {
        _repo = repo;
        _alunoRepo = alunoRepo;
    }

    public async Task<CheckinResponseDto> RegistrarAsync(int alunoId)
    {
        if (!await _repo.AlunoExisteAsync(alunoId))
            throw new InvalidOperationException("Aluno não encontrado.");
        if (!await _repo.TemMatriculaVigenteAsync(alunoId))
            throw new InvalidOperationException("Aluno sem matrícula vigente.");
        if (await _repo.JaFezCheckinHojeAsync(alunoId))
            throw new InvalidOperationException("Check-in de hoje já registrado.");

        var criado = await _repo.AddAsync(new Checkin { AlunoId = alunoId });
        var aluno = await _alunoRepo.GetByIdAsync(alunoId);
        return new CheckinResponseDto(criado.Id, criado.AlunoId, aluno?.Nome ?? "", criado.DataHora);
    }

    public async Task<List<CheckinResponseDto>> GetAllAsync() =>
        await ParaDtosAsync(await _repo.GetAllAsync());

    public async Task<List<CheckinResponseDto>> GetByAlunoIdAsync(int alunoId) =>
        await ParaDtosAsync(await _repo.GetByAlunoIdAsync(alunoId));

    private async Task<List<CheckinResponseDto>> ParaDtosAsync(List<Checkin> lista)
    {
        var nomes = new Dictionary<int, string>();
        var resultado = new List<CheckinResponseDto>();
        foreach (var c in lista)
        {
            if (!nomes.ContainsKey(c.AlunoId))
                nomes[c.AlunoId] = (await _alunoRepo.GetByIdAsync(c.AlunoId))?.Nome ?? "";
            resultado.Add(new CheckinResponseDto(c.Id, c.AlunoId, nomes[c.AlunoId], c.DataHora));
        }
        return resultado;
    }
}