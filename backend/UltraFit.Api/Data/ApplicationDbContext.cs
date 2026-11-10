using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Models;


namespace UltraFit.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Plano> Planos => Set<Plano>();

    public DbSet<Professor> Professores => Set<Professor>();
    public DbSet<Matricula> Matriculas => Set<Matricula>();
    public DbSet<Pagamento> Pagamentos => Set<Pagamento>();
    public DbSet<Checkin> Checkins => Set<Checkin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Usuario é só uma classe base em C#; as colunas são mapeadas nas tabelas Alunos e Professores.
        modelBuilder.Ignore<Usuario>();

        modelBuilder.Entity<Pagamento>()
            .ToTable(tb => tb.HasTrigger("trg_MarcarInadimplencia"));
    }
}
