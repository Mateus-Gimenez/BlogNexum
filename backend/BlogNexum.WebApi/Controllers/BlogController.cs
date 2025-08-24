using BlogNexum.WebApi.Data;
using BlogNexum.WebApi.DTOs;
using BlogNexum.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BlogNexum.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requer autenticação para todas as rotas neste controlador
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST /api/posts
        [HttpPost]
        public async Task<IActionResult> CreatePost(CreatePostDto createPostDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var post = new Postagem
            {
                Titulo = createPostDto.Titulo,
                Conteudo = createPostDto.Conteudo,
                DataCriacao = DateTime.UtcNow,
                UsuarioId = userId
            };

            _context.Postagens.Add(post);
            await _context.SaveChangesAsync();

            // Retorna o post recém-criado com mais detalhes
            var postDetails = new PostDetailsDto
            {
                Id = post.Id,
                Titulo = post.Titulo,
                Conteudo = post.Conteudo,
                DataCriacao = post.DataCriacao,
                AutorId = post.UsuarioId,
                AutorNome = User.Identity.Name // Ou buscar o nome no banco se preferir
            };

            return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, postDetails);
        }

        // GET /api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDetailsDto>> GetPostById(int id)
        {
            var post = await _context.Postagens
                .Include(p => p.Autor)
                .Select(p => new PostDetailsDto
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Conteudo = p.Conteudo,
                    DataCriacao = p.DataCriacao,
                    AutorId = p.UsuarioId,
                    AutorNome = p.Autor.Nome
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        // GET: api/Blog
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PostDetailsDto>>> GetAllPosts()
        {
            var posts = await _context.Postagens
                .Include(p => p.Autor)
                .Select(p => new PostDetailsDto
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Conteudo = p.Conteudo,
                    DataCriacao = p.DataCriacao,
                    AutorId = p.UsuarioId,
                    AutorNome = p.Autor.Nome
                })
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(posts);
        }

        // PUT: api/Blog/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, UpdatePostDto updatePostDto)
        {
            var post = await _context.Postagens.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (post.UsuarioId != userId)
            {
                return Forbid();
            }

            post.Titulo = updatePostDto.Titulo ?? post.Titulo;
            post.Conteudo = updatePostDto.Conteudo ?? post.Conteudo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Blog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Postagens.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
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
