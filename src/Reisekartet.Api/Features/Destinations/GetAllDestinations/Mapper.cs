using FastEndpoints;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal class Mapper : ResponseMapper<Response, IEnumerable<Destination>>
{
    public override Response FromEntity(IEnumerable<Destination> e) =>
        new(
            e.Select(t => new DestinationDto(
                    t.Id!,
                    t.Name,
                    t.Website,
                    t.Type,
                    t.Location.Coordinates.Latitude,
                    t.Location.Coordinates.Longitude
                )
            ).ToArray()
        );
}
