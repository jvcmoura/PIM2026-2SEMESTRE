using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;

namespace UltraFit.Api.Repositories;

public interface IProfessorRepository
{
    Task<List<Professor>> GetAllAsync();
    Task<Professor?> GetByIdAsync(int id);
    Task<Professor?> GetByEmailAsync(string email);
    Task AddAsync(Professor professor);
    Task UpdateAsync(Professor professor);
    Task DeleteAsync(Professor professor);
}

public class ProfessorRepository : IProfessorRepository
{
    private readonly ApplicationDbContext _context;

    public ProfessorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Professor>> GetAllAsync() =>
        await _context.Professores.AsNoTracking().ToListAsync();

    public async Task<Professor?> GetByIdAsync(int id) =>
        await _context.Professores.FindAsync(id);

    public async Task<Professor?> GetByEmailAsync(string email) =>
        await _context.Professores.FirstOrDefaultAsync(p => p.Email == email);

    public async Task AddAsync(Professor professor)
    {
        _context.Professores.Add(professor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Professor professor)
    {
        _context.Professores.Update(professor);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Professor professor)
    {
        _context.Professores.Remove(professor);
        await _context.SaveChangesAsync();
    }
}
