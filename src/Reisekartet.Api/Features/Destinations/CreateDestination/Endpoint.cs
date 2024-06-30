using FastEndpoints;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.Features.Destinations.CreateDestination;

internal sealed class Endpoint(ReisekartetDbContext db) : EndpointWithMapper<Request,Mapper>
{
    public override void Configure()
    {
        Post("/destinations");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var destination = Map.ToEntity(req);
        await db.Destinations.InsertOneAsync(destination, cancellationToken: ct);
        await SendAsync(null, statusCode: 201, cancellation: ct);
    }
}
