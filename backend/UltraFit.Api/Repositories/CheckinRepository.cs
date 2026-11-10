using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;

namespace UltraFit.Api.Repositories;

public interface ICheckinRepository
{
    Task<Checkin> AddAsync(Checkin checkin);
    Task<List<Checkin>> GetAllAsync();
    Task<List<Checkin>> GetByAlunoIdAsync(int alunoId);
    Task<bool> AlunoExisteAsync(int alunoId);
    Task<bool> TemMatriculaVigenteAsync(int alunoId);
    Task<bool> JaFezCheckinHojeAsync(int alunoId);
}

public class CheckinRepository : ICheckinRepository
{
    private readonly ApplicationDbContext _context;
    public CheckinRepository(ApplicationDbContext context) => _context = context;

    public async Task<Checkin> AddAsync(Checkin checkin)
    {
        _context.Checkins.Add(checkin);
        await _context.SaveChangesAsync();
        return checkin;
    }

    public Task<List<Checkin>> GetAllAsync() =>
        _context.Checkins.OrderByDescending(c => c.DataHora).ToListAsync();

    public Task<List<Checkin>> GetByAlunoIdAsync(int alunoId) =>
        _context.Checkins.Where(c => c.AlunoId == alunoId)
            .OrderByDescending(c => c.DataHora).ToListAsync();

    public Task<bool> AlunoExisteAsync(int alunoId) =>
        _context.Alunos.AnyAsync(a => a.Id == alunoId);

    public Task<bool> TemMatriculaVigenteAsync(int alunoId)
    {
        var hoje = DateTime.Today;
        return _context.Matriculas.AnyAsync(m =>
            m.AlunoId == alunoId && m.DataInicio <= hoje && m.DataFim >= hoje);
    }

    public Task<bool> JaFezCheckinHojeAsync(int alunoId)
    {
        var inicio = DateTime.Today;
        var fim = inicio.AddDays(1);
        return _context.Checkins.AnyAsync(c =>
            c.AlunoId == alunoId && c.DataHora >= inicio && c.DataHora < fim);
    }
}