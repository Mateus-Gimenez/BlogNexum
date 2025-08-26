using BlogNexum.WebApi.Data;
using BlogNexum.WebApi.DTOs;
using BlogNexum.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Security.Claims;
using BCrypt.Net;
using BlogNexum.WebApi.Services;

namespace BlogNexum.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == registerDto.Email))
            {
                return Conflict(new { message = "E-mail já cadastrado." });
            }

            var usuario = new Usuario
            {
                Nome = registerDto.Nome,
                Email = registerDto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Senha),
                Ativo = true,
                DataInclusao = DateTime.UtcNow,
                DataAlteracao = DateTime.UtcNow
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDto.Senha, usuario.SenhaHash))
            {
                return Unauthorized("Credenciais inválidas.");
            }

            var token = _tokenService.GenerateToken(usuario);

            return Ok(new TokenDto { Token = token });
        }
    }
}
