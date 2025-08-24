using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogNexum.WebApi.Models
{
    public class Postagem : BlogCommon
    {
        [Required]
        [StringLength(200)]
        public string Titulo { get; set; }

        [Required]
        public string Conteudo { get; set; }

        [ForeignKey("Usuario")]
        public Guid UsuarioId { get; set; }
        public virtual Usuario Autor { get; set; }
    }
}
