using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;

namespace UltraFit.Api.Controllers;

[ApiController]
public class CheckinsController : ControllerBase
{
    private readonly ICheckinService _service;
    public CheckinsController(ICheckinService service) => _service = service;

    private int AlunoIdLogado() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    // ----- Aluno -----
    [HttpPost("api/me/checkins")]
    [Authorize(Roles = "Aluno")]
    public async Task<ActionResult<CheckinResponseDto>> Registrar()
    {
        try { return Ok(await _service.RegistrarAsync(AlunoIdLogado())); }
        catch (InvalidOperationException ex) { return BadRequest(new { erro = ex.Message }); }
    }

    [HttpGet("api/me/checkins")]
    [Authorize(Roles = "Aluno")]
    public async Task<ActionResult<List<CheckinResponseDto>>> MeusCheckins() =>
        Ok(await _service.GetByAlunoIdAsync(AlunoIdLogado()));

    // ----- Professor -----
    [HttpGet("api/checkins")]
    [Authorize(Roles = "Professor")]
    public async Task<ActionResult<List<CheckinResponseDto>>> Todos() =>
        Ok(await _service.GetAllAsync());
}