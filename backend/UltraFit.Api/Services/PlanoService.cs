using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IPlanoService
{
    Task<List<PlanoResponseDto>> GetAllAsync();
    Task<PlanoResponseDto?> GetByIdAsync(int id);
    Task<PlanoResponseDto> CreateAsync(PlanoCreateDto dto);
    Task<PlanoResponseDto?> UpdateAsync(int id, PlanoCreateDto dto);
    Task<bool> DeleteAsync(int id);
}

public class PlanoService : IPlanoService
{
    private readonly IPlanoRepository _repository;

    public PlanoService(IPlanoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<PlanoResponseDto>> GetAllAsync()
    {
        var planos = await _repository.GetAllAsync();
        return planos.Select(ToDto).ToList();
    }

    public async Task<PlanoResponseDto?> GetByIdAsync(int id)
    {
        var plano = await _repository.GetByIdAsync(id);
        return plano is null ? null : ToDto(plano);
    }

    public async Task<PlanoResponseDto> CreateAsync(PlanoCreateDto dto)
    {
        var plano = new Plano
        {
            NomePlano = dto.NomePlano,
            Valor = dto.Valor,
            DuracaoMeses = dto.DuracaoMeses
        };

        await _repository.AddAsync(plano);
        return ToDto(plano);
    }

    public async Task<PlanoResponseDto?> UpdateAsync(int id, PlanoCreateDto dto)
    {
        var plano = await _repository.GetByIdAsync(id);
        if (plano is null) return null;

        plano.NomePlano = dto.NomePlano;
        plano.Valor = dto.Valor;
        plano.DuracaoMeses = dto.DuracaoMeses;

        await _repository.UpdateAsync(plano);
        return ToDto(plano);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var plano = await _repository.GetByIdAsync(id);
        if (plano is null) return false;

        await _repository.DeleteAsync(plano);
        return true;
    }

    private static PlanoResponseDto ToDto(Plano p) =>
        new(p.Id, p.NomePlano, p.Valor, p.DuracaoMeses, p.Ativo);
}