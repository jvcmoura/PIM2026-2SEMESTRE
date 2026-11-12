namespace UltraFit.Api.Models;

public class Aluno : Usuario
{
    public string Status { get; set; } = "Ativo";

    public override string Perfil => "Aluno";
}
