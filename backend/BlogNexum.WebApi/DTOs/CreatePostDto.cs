using System.ComponentModel.DataAnnotations;

namespace BlogNexum.WebApi.DTOs
{
    public class CreatePostDto
    {
        [Required]
        [StringLength(200)]
        public string Titulo { get; set; }

        [Required]
        public string Conteudo { get; set; }
    }
}
