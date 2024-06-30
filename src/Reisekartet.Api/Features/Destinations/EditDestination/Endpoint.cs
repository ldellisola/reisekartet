using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.Features.Destinations.EditDestination;

internal sealed class Endpoint(ReisekartetDbContext db) : EndpointWithMapper<Request,Mapper>
{
    public override void Configure()
    {
        Put("/destinations/{Id}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var result = await db.Destinations.ReplaceOneAsync(t=> t.Id == req.Id, Map.ToEntity(req), cancellationToken: ct);

        if (result.MatchedCount is 0)
        {
            await SendAsync(null, statusCode: 404, cancellation: ct);
            return;
        }

        await SendAsync(null, statusCode: 200, cancellation: ct);
    }
}
