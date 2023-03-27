using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Reisekartet.Entities.Config;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder RunMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ReisekartetDbContext>();
        dbContext.Database.Migrate();
        return app;
    }
}
