using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Reisekartet.Entities.Config;



public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddReisekartetDbContext(this IServiceCollection services)
    {
        services.ConfigureOptions<DatabaseOptionsSetup>();
        services.AddDbContext<ReisekartetDbContext>( (serviceProvider, options) =>
        {
            var databaseOptions = serviceProvider.GetRequiredService<IOptions<DatabaseOptions>>().Value;
            options.EnableDetailedErrors(databaseOptions.EnableDetailedErrors);
            options.EnableSensitiveDataLogging(databaseOptions.EnableSensitiveDataLogging);
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

            // TODO: Add DB Context provider
            throw new NotImplementedException("Add DB Context provider");
        });

        return services;
    }
}
