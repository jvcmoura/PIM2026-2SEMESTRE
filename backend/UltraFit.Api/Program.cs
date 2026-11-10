using Microsoft.EntityFrameworkCore;
using UltraFit.Api.Controllers;
using UltraFit.Api.Data;
using UltraFit.Api.Repositories;
using UltraFit.Api.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<UltraFit.Api.Repositories.IAlunoRepository, UltraFit.Api.Repositories.AlunoRepository>();
builder.Services.AddScoped<UltraFit.Api.Services.IAlunoService, UltraFit.Api.Services.AlunoService>();
builder.Services.AddScoped<IPlanoRepository, PlanoRepository>();
builder.Services.AddScoped<IPlanoService, PlanoService>();
builder.Services.AddScoped<IProfessorRepository, ProfessorRepository>();
builder.Services.AddScoped<IProfessorService, ProfessorService>();
builder.Services.AddScoped<IMatriculaRepository, MatriculaRepository>();
builder.Services.AddScoped<IMatriculaService, MatriculaService>();
builder.Services.AddScoped<IPagamentoRepository, PagamentoRepository>();
builder.Services.AddScoped<IPagamentoService, PagamentoService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICheckinRepository, CheckinRepository>();
builder.Services.AddScoped<ICheckinService, CheckinService>();


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "CHAVE-PARA-DESBLOQUEIO"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// CORS: permite que a aplicação web (outra origem) consuma a API.
// A autenticação é por token JWT no cabeçalho, sem cookies.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Web", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Web");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
