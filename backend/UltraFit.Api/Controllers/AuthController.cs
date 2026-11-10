using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UltraFit.Api.DTOs;
using UltraFit.Api.Services;

namespace UltraFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var resultado = await _service.LoginAsync(dto);

        // Mesma mensagem para e-mail errado e senha errada, para não revelar quais e-mails existem
        return resultado is null
            ? Unauthorized(new { message = "E-mail ou senha inválidos." })
            : Ok(resultado);
    }
}