using FastEndpoints;
using Reisekartet.Api.Configuration;

namespace Reisekartet.Api.Features.Configuration;

internal class Response
{
    public string? TileServer { get; set; }
    public string? Projection { get; set; }
}

internal sealed class ResponseMapper : ResponseMapper<Response, MapsConfiguration>
{
    public override Response FromEntity(MapsConfiguration e) =>
        new()
        {
            TileServer = e.TileServer,
            Projection = e.Projection
        };
}

