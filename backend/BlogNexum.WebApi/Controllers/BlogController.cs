using BlogNexum.WebApi.Data;
using BlogNexum.WebApi.DTOs;
using BlogNexum.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BlogNexum.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(CreatePostDto createPostDto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var post = new Postagem
            {
                Titulo = createPostDto.Titulo,
                Conteudo = createPostDto.Conteudo,
                UsuarioId = userId
            };

            _context.Postagens.Add(post);
            await _context.SaveChangesAsync();

            var author = await _context.Usuarios.FindAsync(userId);

            var postDetails = new PostDetailsDto
            {
                Id = post.Id,
                Titulo = post.Titulo,
                Conteudo = post.Conteudo,
                DataCriacao = post.DataInclusao,
                AutorId = post.UsuarioId,
                AutorNome = author?.Nome
            };

            return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, postDetails);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PostDetailsDto>> GetPostById(Guid id)
        {
            var post = await _context.Postagens
                .Where(p => p.Id == id)
                .Include(p => p.Autor)
                .Select(p => new PostDetailsDto
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Conteudo = p.Conteudo,
                    DataCriacao = p.DataInclusao,
                    AutorId = p.UsuarioId,
                    AutorNome = p.Autor.Nome
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PostDetailsDto>>> GetAllPosts([FromQuery(Name = "meus_posts")] bool meusPosts = false)
        {
            var query = _context.Postagens.AsQueryable();

            if (meusPosts)
            {
                if (!User.Identity.IsAuthenticated)
                {
                    return Unauthorized();
                }
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                query = query.Where(p => p.UsuarioId == userId);
            }

            var posts = await query
                .Include(p => p.Autor)
                .Select(p => new PostDetailsDto
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Conteudo = p.Conteudo,
                    DataCriacao = p.DataInclusao,
                    AutorId = p.UsuarioId,
                    AutorNome = p.Autor.Nome
                })
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(Guid id, UpdatePostDto updatePostDto)
        {
            var post = await _context.Postagens.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (post.UsuarioId != userId)
            {
                return Forbid();
            }

            post.Titulo = updatePostDto.Titulo ?? post.Titulo;
            post.Conteudo = updatePostDto.Conteudo ?? post.Conteudo;
            post.DataAlteracao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Postagens.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (post.UsuarioId != userId)
            {
                return Forbid();
            }

            _context.Postagens.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
