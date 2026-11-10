using UltraFit.Api.DTOs;
using UltraFit.Api.Models;
using UltraFit.Api.Repositories;

namespace UltraFit.Api.Services;

public interface IPagamentoService
{
    Task<List<PagamentoResponseDto>> GetAllAsync();
    Task<PagamentoResponseDto?> GetByIdAsync(int id);
    Task<PagamentoResponseDto> CreateAsync(PagamentoCreateDto dto);
    Task<PagamentoResponseDto?> RegistrarPagamentoAsync(int id);
    Task<bool> DeleteAsync(int id);
    Task<List<InadimplenteDto>> GetInadimplentesAsync();

    Task<List<PagamentoResponseDto>> GetByAlunoAsync(int alunoId);
}

public class PagamentoService : IPagamentoService
{
    private readonly IPagamentoRepository _repository;
    private readonly IAlunoRepository _alunoRepository;
    private readonly IMatriculaRepository _matriculaRepository;

    public PagamentoService(
        IPagamentoRepository repository,
        IAlunoRepository alunoRepository,
        IMatriculaRepository matriculaRepository)
    {
        _repository = repository;
        _alunoRepository = alunoRepository;
        _matriculaRepository = matriculaRepository;
    }

    public async Task<List<PagamentoResponseDto>> GetAllAsync()
    {
        var pagamentos = await _repository.GetAllAsync();
        var resultado = new List<PagamentoResponseDto>();

        foreach (var p in pagamentos)
            resultado.Add(await ToDtoAsync(p));

        return resultado;
    }

    public async Task<PagamentoResponseDto?> GetByIdAsync(int id)
    {
        var pagamento = await _repository.GetByIdAsync(id);
        return pagamento is null ? null : await ToDtoAsync(pagamento);
    }

    public async Task<PagamentoResponseDto> CreateAsync(PagamentoCreateDto dto)
    {
        _ = await _alunoRepository.GetByIdAsync(dto.AlunoId)
            ?? throw new InvalidOperationException("Aluno não encontrado.");

        var matricula = await _matriculaRepository.GetByIdAsync(dto.MatriculaId)
            ?? throw new InvalidOperationException("Matrícula não encontrada.");

        if (matricula.AlunoId != dto.AlunoId)
            throw new InvalidOperationException("Essa matrícula não pertence ao aluno informado.");

        var pagamento = new Pagamento
        {
            AlunoId = dto.AlunoId,
            MatriculaId = dto.MatriculaId,
            Valor = dto.Valor,
            DataVencimento = dto.DataVencimento,
            Status = "Pendente"
        };

        await _repository.AddAsync(pagamento);

        // Relê do banco: a trigger pode ter trocado o Status para "Atrasado"
        var atualizado = await _repository.GetByIdAsync(pagamento.Id);
        return await ToDtoAsync(atualizado!);
    }

    // "Dar baixa": chama a procedure sp_RegistrarPagamento
    public async Task<PagamentoResponseDto?> RegistrarPagamentoAsync(int id)
    {
        var pagamento = await _repository.GetByIdAsync(id);
        if (pagamento is null) return null;

        if (pagamento.Status == "Pago")
            throw new InvalidOperationException("Esse pagamento já foi registrado como pago.");

        await _repository.RegistrarPagamentoAsync(id, DateTime.Today);

        var atualizado = await _repository.GetByIdAsync(id);
        return await ToDtoAsync(atualizado!);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var pagamento = await _repository.GetByIdAsync(id);
        if (pagamento is null) return false;

        await _repository.DeleteAsync(pagamento);
        return true;
    }

    private async Task<PagamentoResponseDto> ToDtoAsync(Pagamento p)
    {
        var aluno = await _alunoRepository.GetByIdAsync(p.AlunoId);

        return new PagamentoResponseDto(
            p.Id, p.AlunoId, aluno?.Nome ?? "Desconhecido",
            p.MatriculaId, p.Valor, p.DataVencimento, p.DataPagamento, p.Status
        );
    }

public async Task<List<InadimplenteDto>> GetInadimplentesAsync() =>
    await _repository.GetInadimplentesAsync();

    public async Task<List<PagamentoResponseDto>> GetByAlunoAsync(int alunoId)
{
    var pagamentos = await _repository.GetByAlunoIdAsync(alunoId);
    var resultado = new List<PagamentoResponseDto>();

    foreach (var p in pagamentos)
        resultado.Add(await ToDtoAsync(p));

    return resultado;
}
}