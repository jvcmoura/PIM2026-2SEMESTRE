namespace UltraFit.Api.Models;

public class Professor
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
    public string? Telefone { get; set; }
    public string? Horario { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.Now;
}