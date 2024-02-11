using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.Features.Destinations.Get;

internal sealed class Endpoint(ReisekartetDbContext db) : Endpoint<Request, Response, Mapper>
{
    public override void Configure()
    {
        Get("/destinations/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var destination = await db.Destinations.Find(d => d.Id == req.Id).FirstOrDefaultAsync(ct);
        if (destination is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }
        await SendOkAsync(Map.FromEntity(destination), ct);
    }
}
