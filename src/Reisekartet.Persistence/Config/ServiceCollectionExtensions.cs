using Microsoft.Extensions.DependencyInjection;

namespace Reisekartet.Persistence.Config;


public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddReisekartetDbContext(this IServiceCollection services) =>
        services
            .ConfigureOptions<DatabaseOptionsSetup>()
            .AddSingleton<ReisekartetDbContext>();
}
