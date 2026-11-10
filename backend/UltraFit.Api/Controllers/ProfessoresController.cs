using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Professor")]

public class ProfessoresController : ControllerBase
{
    private readonly IProfessorService _service;

    public ProfessoresController(IProfessorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var professor = await _service.GetByIdAsync(id);
        return professor is null ? NotFound() : Ok(professor);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProfessorCreateDto dto)
    {
        try
        {
            var professor = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = professor.Id }, professor);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProfessorCreateDto dto)
    {
        var professor = await _service.UpdateAsync(id, dto);
        return professor is null ? NotFound() : Ok(professor);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sucesso = await _service.DeleteAsync(id);
        return sucesso ? NoContent() : NotFound();
    }
}