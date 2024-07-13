using Microsoft.Extensions.Options;
using Reisekartet.Api.Extensions;

namespace Reisekartet.Api.Configuration;

public class MapsConfiguration
{
    public string? TileServer { get; set; }
    public bool UseCache  => RedisConnectionString is not null;
    public string? RedisConnectionString { get; set; }
    public TimeSpan? CacheDuration { get; set; }
}

public class MapsConfigurationSetup(IConfiguration configuration) : IConfigureOptions<MapsConfiguration>
{
    public void Configure(MapsConfiguration options)
    {
        options.TileServer = configuration.GetValue<string>("TILE_SERVER") ?? configuration.GetValue<string>("Maps:TileServer") ?? "https://tile.openstreetmap.org/{x}/{y}/{z}.png";
        options.RedisConnectionString = configuration.GetValue<string>("REDIS_CONNECTION_STRING") ?? configuration.GetConnectionString("Redis");
        options.CacheDuration = configuration.GetValue<string>("CACHE_DURATION")?.ToTimeSpan() ?? configuration.GetValue<string>("Maps:CacheDuration")?.ToTimeSpan() ?? TimeSpan.FromDays(1);
    }
}
