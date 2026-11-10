using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Data;
using UltraFit.Api.Models;

namespace UltraFit.Api.Repositories;

public interface IPlanoRepository
{
    Task<List<Plano>> GetAllAsync();
    Task<Plano?> GetByIdAsync(int id);
    Task AddAsync(Plano plano);
    Task UpdateAsync(Plano plano);
    Task DeleteAsync(Plano plano);
}

public class PlanoRepository : IPlanoRepository
{
    private readonly ApplicationDbContext _context;

    public PlanoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Plano>> GetAllAsync() =>
        await _context.Planos.AsNoTracking().ToListAsync();

    public async Task<Plano?> GetByIdAsync(int id) =>
        await _context.Planos.FindAsync(id);

    public async Task AddAsync(Plano plano)
    {
        _context.Planos.Add(plano);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Plano plano)
    {
        _context.Planos.Update(plano);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Plano plano)
    {
        _context.Planos.Remove(plano);
        await _context.SaveChangesAsync();
    }
}
