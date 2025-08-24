using System;

namespace BlogNexum.WebApi.DTOs
{
    public class PostDetailsDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Conteudo { get; set; }
        public DateTime DataCriacao { get; set; }
        public string AutorNome { get; set; }
        public int AutorId { get; set; }
    }
}
