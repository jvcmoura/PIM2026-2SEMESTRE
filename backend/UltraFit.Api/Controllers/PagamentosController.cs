using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Professor")]
public class PagamentosController : ControllerBase
{
    private readonly IPagamentoService _service;

    public PagamentosController(IPagamentoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pagamento = await _service.GetByIdAsync(id);
        return pagamento is null ? NotFound() : Ok(pagamento);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PagamentoCreateDto dto)
    {
        try
        {
            var pagamento = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = pagamento.Id }, pagamento);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Dar baixa no pagamento (chama a procedure sp_RegistrarPagamento)
    [HttpPatch("{id:int}/pagar")]
    public async Task<IActionResult> RegistrarPagamento(int id)
    {
        try
        {
            var pagamento = await _service.RegistrarPagamentoAsync(id);
            return pagamento is null ? NotFound() : Ok(pagamento);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sucesso = await _service.DeleteAsync(id);
        return sucesso ? NoContent() : NotFound();
    }
    // Lista alunos inadimplentes (chama a procedure sp_CalcularInadimplencia)
[HttpGet("inadimplentes")]
public async Task<IActionResult> GetInadimplentes() =>
    Ok(await _service.GetInadimplentesAsync());
}