using System;
using System.ComponentModel.DataAnnotations;

namespace BlogNexum.WebApi.Models
{
    public abstract class BlogCommon
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public bool Ativo { get; set; } = true;
        public DateTime DataInclusao { get; set; } = DateTime.UtcNow;
        public DateTime DataAlteracao { get; set; } = DateTime.UtcNow;
    }
}
