using FastEndpoints;
using Reisekartet.Api.Configuration;

namespace Reisekartet.Api.Features.Configuration;

internal sealed class Response
{
    public string? TileServer { get; set; }
    public string? Projection { get; set; }
}

internal sealed class ResponseMapper : ResponseMapper<Response, MapsConfiguration>
{
    public override Response FromEntity(MapsConfiguration e) =>
        new()
        {
            TileServer = e.UseCache ? "/api/tiles/{z}/{x}/{y}.png" : e.TileServer,
            Projection = e.Projection
        };
}

