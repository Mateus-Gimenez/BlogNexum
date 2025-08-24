using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BlogNexum.WebApi.Models
{
    public class Usuario : BlogCommon
    {
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string SenhaHash { get; set; }

        public virtual ICollection<Postagem> Postagens { get; set; }
    }
}
