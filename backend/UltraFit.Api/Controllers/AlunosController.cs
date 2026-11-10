using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UltraFit.Api.Controllers;



[ApiController]
[Route("api/[controller]")]

public class AlunosController : ControllerBase
{
    private readonly IAlunoService _service;

    public AlunosController(IAlunoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var aluno = await _service.GetByIdAsync(id);
        return aluno is null ? NotFound() : Ok(aluno);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create(AlunoCreateDto dto)
    {
        try
        {
            var aluno = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, aluno);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
[HttpPut("{id:int}")]
public async Task<IActionResult> Update(int id, AlunoCreateDto dto)
{
    var aluno = await _service.UpdateAsync(id, dto);
    return aluno is null ? NotFound() : Ok(aluno);
}

[HttpDelete("{id:int}")]
public async Task<IActionResult> Delete(int id)
{
    var sucesso = await _service.DeleteAsync(id);
    return sucesso ? NoContent() : NotFound();
}

}