using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.Services;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/me")]
[Authorize(Roles = "Aluno")]
public class MeController : ControllerBase
{
    private readonly IAlunoService _alunoService;
    private readonly IMatriculaService _matriculaService;
    private readonly IPagamentoService _pagamentoService;

    public MeController(
        IAlunoService alunoService,
        IMatriculaService matriculaService,
        IPagamentoService pagamentoService)
    {
        _alunoService = alunoService;
        _matriculaService = matriculaService;
        _pagamentoService = pagamentoService;
    }

    // O id vem de dentro do token, nunca da URL. Assim o aluno só enxerga os próprios dados.
    private int AlunoId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Dados do próprio aluno (tela inicial do app)
    [HttpGet]
    public async Task<IActionResult> GetPerfil()
    {
        var aluno = await _alunoService.GetByIdAsync(AlunoId);
        return aluno is null ? NotFound() : Ok(aluno);
    }

    [HttpGet("matriculas")]
    public async Task<IActionResult> GetMatriculas() =>
        Ok(await _matriculaService.GetByAlunoAsync(AlunoId));

    [HttpGet("pagamentos")]
    public async Task<IActionResult> GetPagamentos() =>
        Ok(await _pagamentoService.GetByAlunoAsync(AlunoId));
}