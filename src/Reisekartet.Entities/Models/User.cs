using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Reisekartet.Entities.Models;

public class User
{
    public string Name { get; set; } = string.Empty;
}

internal sealed class UserConfigurator: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(t => t.Name)
            .IsRequired();
    }
}
