namespace UltraFit.Api.DTOs;

public record PagamentoCreateDto(int AlunoId, int MatriculaId, decimal Valor, DateTime DataVencimento);

public record PagamentoResponseDto(int Id, int AlunoId, string NomeAluno, int MatriculaId, decimal Valor, DateTime DataVencimento, DateTime? DataPagamento, string Status);

// Resultado da procedure sp_CalcularInadimplencia
// Os nomes das propriedades precisam ser iguais aos nomes das colunas que a procedure devolve
public class InadimplenteDto
{
    public int AlunoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal TotalEmAtraso { get; set; }
    public int QuantidadeParcelasAtrasadas { get; set; }
}