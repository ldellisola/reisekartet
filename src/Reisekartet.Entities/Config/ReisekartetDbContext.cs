using Reisekartet.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Reisekartet.Entities.Config;

public class ReisekartetDbContext : DbContext
{
    public ReisekartetDbContext(DbContextOptions<ReisekartetDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ReisekartetDbContext).Assembly);
    }
}
