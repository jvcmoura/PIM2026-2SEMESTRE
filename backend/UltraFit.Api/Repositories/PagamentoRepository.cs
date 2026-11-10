using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;
using UltraFit.Api.DTOs;


namespace UltraFit.Api.Repositories;

public interface IPagamentoRepository
{
    Task<List<Pagamento>> GetAllAsync();
    Task<Pagamento?> GetByIdAsync(int id);
    Task AddAsync(Pagamento pagamento);
    Task DeleteAsync(Pagamento pagamento);
    Task RegistrarPagamentoAsync(int pagamentoId, DateTime dataPagamento);
    Task<List<InadimplenteDto>> GetInadimplentesAsync();

    Task<List<Pagamento>> GetByAlunoIdAsync(int alunoId);
}

public class PagamentoRepository : IPagamentoRepository
{
    private readonly ApplicationDbContext _context;

    public PagamentoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Pagamento>> GetAllAsync() =>
        await _context.Pagamentos.AsNoTracking().ToListAsync();

    // AsNoTracking de propósito: a trigger e a procedure mudam o Status direto no banco,
    // e queremos sempre ler o valor atualizado, não uma cópia antiga em memória
    public async Task<Pagamento?> GetByIdAsync(int id) =>
        await _context.Pagamentos.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public async Task AddAsync(Pagamento pagamento)
    {
        _context.Pagamentos.Add(pagamento);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Pagamento pagamento)
    {
        _context.Pagamentos.Remove(pagamento);
        await _context.SaveChangesAsync();
    }

    // Chama a procedure que já criamos no banco
    public async Task RegistrarPagamentoAsync(int pagamentoId, DateTime dataPagamento)
    {
        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC sp_RegistrarPagamento @PagamentoId = {pagamentoId}, @DataPagamento = {dataPagamento.Date}");
    }

    // Chama a procedure sp_CalcularInadimplencia e mapeia o resultado direto no DTO
public async Task<List<InadimplenteDto>> GetInadimplentesAsync() =>
    await _context.Database
        .SqlQuery<InadimplenteDto>($"EXEC sp_CalcularInadimplencia")
        .ToListAsync();

public async Task<List<Pagamento>> GetByAlunoIdAsync(int alunoId) =>
    await _context.Pagamentos.AsNoTracking()
        .Where(p => p.AlunoId == alunoId)
        .OrderBy(p => p.DataVencimento)
        .ToListAsync();
}