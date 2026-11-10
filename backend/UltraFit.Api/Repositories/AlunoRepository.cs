using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;

namespace UltraFit.Api.Repositories;

public interface IAlunoRepository
{
    Task<List<Aluno>> GetAllAsync();
    Task<Aluno?> GetByIdAsync(int id);
    Task<Aluno?> GetByEmailAsync(string email);
    Task AddAsync(Aluno aluno);
    Task UpdateAsync(Aluno aluno);
    Task DeleteAsync(Aluno aluno);
}

public class AlunoRepository : IAlunoRepository
{
    private readonly ApplicationDbContext _context;

    public AlunoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Aluno>> GetAllAsync() =>
        await _context.Alunos.AsNoTracking().ToListAsync();

    public async Task<Aluno?> GetByIdAsync(int id) =>
        await _context.Alunos.FindAsync(id);

    public async Task<Aluno?> GetByEmailAsync(string email) =>
        await _context.Alunos.FirstOrDefaultAsync(a => a.Email == email);

    public async Task AddAsync(Aluno aluno)
    {
        _context.Alunos.Add(aluno);
        await _context.SaveChangesAsync();
    }

public async Task UpdateAsync(Aluno aluno)
{
    _context.Alunos.Update(aluno);
    await _context.SaveChangesAsync();
}

public async Task DeleteAsync(Aluno aluno)
{
    _context.Alunos.Remove(aluno);
    await _context.SaveChangesAsync();
}
}