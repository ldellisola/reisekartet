using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal sealed class Endpoint : Endpoint<Request,Response,Mapper>
{
    private readonly ReisekartetDbContext _db;

    public Endpoint(ReisekartetDbContext db) => _db = db;

    public override void Configure()
    {
        Get("/destinations");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var cursor = await _db.Destinations.FindAsync(Builders<Destination>.Filter.Empty, cancellationToken: ct);
        var destinations = await cursor.ToListAsync(ct);
        await SendOkAsync(Map.FromEntity(destinations), ct);
    }
}
