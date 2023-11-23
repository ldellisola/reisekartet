using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal sealed class Endpoint(ReisekartetDbContext db) : Endpoint<Request,Response,Mapper>
{
    public override void Configure()
    {
        Get("/destinations");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var cursor = await db.Destinations.FindAsync(Builders<Destination>.Filter.Empty, cancellationToken: ct);
        var destinations = await cursor.ToListAsync(ct);
        await SendOkAsync(Map.FromEntity(destinations), ct);
    }
}
