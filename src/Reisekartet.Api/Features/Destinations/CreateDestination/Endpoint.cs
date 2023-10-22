using FastEndpoints;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.Features.Destinations.CreateDestination;

internal class Endpoint: EndpointWithMapper<Request,Mapper>
{
    private readonly ReisekartetDbContext _db;

    public Endpoint(ReisekartetDbContext db) => _db = db;

    public override void Configure()
    {
        Post("/destinations");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var destination = Map.ToEntity(req);
        await _db.Destinations.InsertOneAsync(destination, cancellationToken: ct);
        await SendAsync(null, statusCode: 201, cancellation: ct);
    }
}
