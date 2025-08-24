using BlogNexum.WebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogNexum.WebApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Postagem> Postagens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração do relacionamento Usuario -> Postagem
            modelBuilder.Entity<Usuario>()
                .HasMany(u => u.Postagens)
                .WithOne(p => p.Autor)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade); // Se um usuário for deletado, suas postagens também serão.

            // Configuração da entidade Postagem
            modelBuilder.Entity<Postagem>()
                .HasOne(p => p.Autor)
                .WithMany(u => u.Postagens)
                .HasForeignKey(p => p.UsuarioId);
        }
    }
}
