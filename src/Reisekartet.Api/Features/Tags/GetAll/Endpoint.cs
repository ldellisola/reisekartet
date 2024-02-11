using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Tags.GetAll;

internal sealed class Endpoint(ReisekartetDbContext db) : EndpointWithoutRequest<Response>
{
    public override void Configure()
    {
        Get("/tags");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        // Write a mongo query to get all tags from the arrays in the destinations collection.
        // Then send the response with SendOkAsync.

        var list = await db.Destinations.Find(Builders<Destination>.Filter.Empty)
            .Project(d => d.Tags)
            .ToListAsync(ct);

        var tags = list.SelectMany(x => x).Distinct().Select(t=> new TagDto(t)).ToArray();
        await SendOkAsync(new Response(tags), ct);
    }
}
