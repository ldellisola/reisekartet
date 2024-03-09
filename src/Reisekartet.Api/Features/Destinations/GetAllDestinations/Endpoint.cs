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
        var filter = req.Filters.Aggregate(Builders<Destination>.Filter.Empty, (filter, filterItem) =>
        {
            return filter & filterItem.Type switch
            {
                FilterType.Tag => Builders<Destination>.Filter.AnyEq(x => x.Tags, filterItem.Text),
                FilterType.Name => Builders<Destination>.Filter.Eq(x => x.Name, filterItem.Text),
                FilterType.City => Builders<Destination>.Filter.Eq(x => x.City, filterItem.Text),
                FilterType.Country => Builders<Destination>.Filter.Eq(x => x.Country, filterItem.Text),
                _ => throw new ArgumentOutOfRangeException(nameof(filterItem))
            };
        });

        var cursor = await db.Destinations.FindAsync(filter, cancellationToken: ct);
        var destinations = await cursor.ToListAsync(ct);
        await SendOkAsync(Map.FromEntity(destinations), ct);
    }
}
