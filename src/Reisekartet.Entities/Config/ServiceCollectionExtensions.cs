using Microsoft.Extensions.DependencyInjection;
using Reisekartet.Entities.Interfaces;
using Reisekartet.Entities.Repositories;

namespace Reisekartet.Entities.Config;


public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddReisekartetDbContext(this IServiceCollection services)
    {
        services.ConfigureOptions<DatabaseOptionsSetup>();
        services.AddSingleton<ReisekartetDbContext>();
        services.AddScoped<IDestinationsRepository, DestinationsRepository>();

        return services;
    }
}
