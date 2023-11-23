using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.DeleteDestination;

internal sealed class Endpoint(ReisekartetDbContext db) : Endpoint<Request>
{
    public override void Configure()
    {
        Delete("/destinations/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var filter = Builders<Destination>.Filter.Eq(x => x.Id, req.Id);
        var result = await db.Destinations.DeleteOneAsync(filter, cancellationToken: ct);

        if (result.DeletedCount == 0)
            await SendNotFoundAsync(ct);
        else
            await SendNoContentAsync(ct);
    }
}
