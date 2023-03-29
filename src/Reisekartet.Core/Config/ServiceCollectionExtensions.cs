using Microsoft.Extensions.DependencyInjection;
using Reisekartet.Core.Interfaces;
using Reisekartet.Core.Services;

namespace Reisekartet.Core.Config;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services)
    {
        services.AddScoped<IDestinationsService, DestinationsService>();

        return services;
    }
}
