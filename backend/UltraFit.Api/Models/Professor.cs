namespace UltraFit.Api.Models;

public class Professor : Usuario
{
    public string? Especialidade { get; set; }
    public string? Horario { get; set; }

    public override string Perfil => "Professor";
}
