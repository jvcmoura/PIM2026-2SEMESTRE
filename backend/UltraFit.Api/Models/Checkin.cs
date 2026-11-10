namespace UltraFit.Api.Models;

public class Checkin
{
    public int Id { get; set; }
    public int AlunoId { get; set; }
    public DateTime DataHora { get; set; } = DateTime.Now;
}