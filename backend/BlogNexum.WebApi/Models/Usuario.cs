using System.Collections.Generic;

namespace BlogNexum.WebApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string SenhaHash { get; set; }

        public ICollection<Postagem> Postagens { get; set; }
    }
}
