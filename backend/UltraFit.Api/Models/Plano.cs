namespace UltraFit.Api.Models;

public class Plano
{
    public int Id { get; set; }
    public string NomePlano { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int DuracaoMeses { get; set; }
    public bool Ativo { get; set; } = true;
}