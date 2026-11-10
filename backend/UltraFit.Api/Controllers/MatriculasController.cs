using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Professor")]

public class MatriculasController : ControllerBase
{
    private readonly IMatriculaService _service;

    public MatriculasController(IMatriculaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var matricula = await _service.GetByIdAsync(id);
        return matricula is null ? NotFound() : Ok(matricula);
    }

    [HttpPost]
    public async Task<IActionResult> Create(MatriculaCreateDto dto)
    {
        try
        {
            var matricula = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = matricula.Id }, matricula);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sucesso = await _service.DeleteAsync(id);
        return sucesso ? NoContent() : NotFound();
    }
}