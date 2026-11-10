using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;

namespace UltraFit.Api.Repositories;

public interface IMatriculaRepository
{
    Task<List<Matricula>> GetAllAsync();
    Task<Matricula?> GetByIdAsync(int id);
    Task AddAsync(Matricula matricula);
    Task UpdateAsync(Matricula matricula);
    Task DeleteAsync(Matricula matricula);

    Task<List<Matricula>> GetByAlunoIdAsync(int alunoId);
    
}

public class MatriculaRepository : IMatriculaRepository
{
    private readonly ApplicationDbContext _context;

    public MatriculaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Matricula>> GetAllAsync() =>
        await _context.Matriculas.AsNoTracking().ToListAsync();

    public async Task<Matricula?> GetByIdAsync(int id) =>
        await _context.Matriculas.FindAsync(id);

    public async Task AddAsync(Matricula matricula)
    {
        _context.Matriculas.Add(matricula);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Matricula matricula)
    {
        _context.Matriculas.Update(matricula);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Matricula matricula)
    {
        _context.Matriculas.Remove(matricula);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Matricula>> GetByAlunoIdAsync(int alunoId) =>
    await _context.Matriculas.AsNoTracking()
        .Where(m => m.AlunoId == alunoId)
        .ToListAsync();
}