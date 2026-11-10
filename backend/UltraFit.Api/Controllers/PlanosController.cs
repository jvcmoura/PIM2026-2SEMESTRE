using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class PlanosController : ControllerBase
{
    private readonly IPlanoService _service;

    public PlanosController(IPlanoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plano = await _service.GetByIdAsync(id);
        return plano is null ? NotFound() : Ok(plano);
    }

    [HttpPost]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Create(PlanoCreateDto dto)
    {
        var plano = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = plano.Id }, plano);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, PlanoCreateDto dto)
    {
        var plano = await _service.UpdateAsync(id, dto);
        return plano is null ? NotFound() : Ok(plano);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sucesso = await _service.DeleteAsync(id);
        return sucesso ? NoContent() : NotFound();
    }
}
