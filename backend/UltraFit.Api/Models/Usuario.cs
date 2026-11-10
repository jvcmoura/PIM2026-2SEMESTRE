using System.ComponentModel.DataAnnotations.Schema;

namespace UltraFit.Api.Models;

/// <summary>
/// Classe base abstrata para quem acessa o sistema (Aluno e Professor).
/// Concentra os dados comuns (herança) e a regra de verificação de senha (encapsulamento).
/// Cada subclasse informa o seu próprio perfil (polimorfismo).
/// </summary>
public abstract class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.Now;

    /// <summary>Perfil usado na autorização por papel (role) do token JWT.</summary>
    [NotMapped]
    public abstract string Perfil { get; }

    /// <summary>Confere a senha informada com o hash BCrypt armazenado.</summary>
    public bool VerificarSenha(string senha)
    {
        // Os usuários do seed têm o texto "HASH_AQUI" no lugar do hash.
        // Sem o try/catch, o BCrypt estoura exceção (erro 500) em vez de recusar o login.
        try
        {
            return BCrypt.Net.BCrypt.Verify(senha, SenhaHash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false;
        }
    }
}
