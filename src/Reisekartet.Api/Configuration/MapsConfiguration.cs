using Microsoft.Extensions.Options;
using Reisekartet.Api.Extensions;

namespace Reisekartet.Api.Configuration;

public class MapsConfiguration
{
    public string? TileServer { get; set; }
    public string? Projection { get; set; }
    public bool UseCache { get; set; }
    public string? RedisConnectionString { get; set; }
    public TimeSpan? CacheDuration { get; set; }
}

public class MapsConfigurationSetup(IConfiguration configuration) : IConfigureOptions<MapsConfiguration>
{
    public void Configure(MapsConfiguration options)
    {
        options.TileServer = configuration.GetValue<string>("TILE_SERVER") ?? configuration.GetValue<string>("Maps:TileServer") ?? "https://tile.openstreetmap.org/{x}/{y}/{z}.png";
        options.Projection = configuration.GetValue<string>("PROJECTION") ?? configuration.GetValue<string>("Maps:Projection") ?? "EPSG:3857";
        options.UseCache = configuration.GetValue<bool>("USE_TILE_SERVER_CACHE") || configuration.GetValue<bool>("Maps:UseCache");
        options.RedisConnectionString = configuration.GetValue<string>("REDIS_CONNECTION_STRING") ?? configuration.GetConnectionString("Redis");
        options.CacheDuration = configuration.GetValue<string>("CACHE_DURATION")?.ToTimeSpan() ?? configuration.GetValue<string>("Maps:CacheDuration")?.ToTimeSpan() ?? TimeSpan.FromDays(1);
    }
}
