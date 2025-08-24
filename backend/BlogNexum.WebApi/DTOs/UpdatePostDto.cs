using System.ComponentModel.DataAnnotations;

namespace BlogNexum.WebApi.DTOs
{
    public class UpdatePostDto
    {
        [StringLength(200)]
        public string Titulo { get; set; }

        public string Conteudo { get; set; }
    }
}
