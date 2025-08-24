using System;

namespace BlogNexum.WebApi.DTOs
{
    public class PostDetailsDto
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; }
        public string Conteudo { get; set; }
        public DateTime DataCriacao { get; set; }
        public string AutorNome { get; set; }
        public Guid AutorId { get; set; }
    }
}
