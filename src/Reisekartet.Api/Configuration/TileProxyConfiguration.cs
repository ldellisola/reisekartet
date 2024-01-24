using System.Net;

namespace Reisekartet.Api.Configuration;

public static class TileProxyConfiguration
{
    public static IServiceCollection AddTileProxy(this IServiceCollection services, IConfiguration configuration)
    {
        var options = new MapsConfiguration();
        new MapsConfigurationSetup(configuration).Configure(options);

        if (options is { UseCache: true, RedisConnectionString: not null })
        {
            services.AddStackExchangeRedisCache(o => o.Configuration = options.RedisConnectionString);
            services.AddHttpClient("tileproxy", (_, client) =>
            {
                client.DefaultRequestVersion = HttpVersion.Version20;
            });

        }

        return services;
    }
}
