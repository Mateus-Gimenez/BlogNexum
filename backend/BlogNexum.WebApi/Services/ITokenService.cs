using BlogNexum.WebApi.Models;

namespace BlogNexum.WebApi.Services
{
    public interface ITokenService
    {
        string GenerateToken(Usuario usuario);
    }
}
