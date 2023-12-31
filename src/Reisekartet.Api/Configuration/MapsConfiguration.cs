using Microsoft.Extensions.Options;

namespace Reisekartet.Api.Configuration;

public class MapsConfiguration
{
    public string? TileServer { get; set; }
    public string? Projection { get; set; }
}

public class MapsConfigurationSetup(IConfiguration configuration) : IConfigureOptions<MapsConfiguration>
{
    public void Configure(MapsConfiguration options)
    {
        options.TileServer = configuration.GetValue<string>("TILE_SERVER") ?? configuration.GetValue<string>("Maps:TileServer") ?? "https://tile.openstreetmap.org/{x}/{y}/{z}.png";
        options.Projection = configuration.GetValue<string>("PROJECTION") ?? configuration.GetValue<string>("Maps:Projection") ?? "EPSG:3857";
    }
}
