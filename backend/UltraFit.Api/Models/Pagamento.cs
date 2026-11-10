namespace UltraFit.Api.Models;

public class Pagamento
{
    public int Id { get; set; }
    public int AlunoId { get; set; }
    public int MatriculaId { get; set; }
    public decimal Valor { get; set; }
    public DateTime DataVencimento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public string Status { get; set; } = "Pendente"; // Pendente, Pago, Atrasado
}