using FastEndpoints;
using Geo.Bing.Models.Responses;

namespace Reisekartet.Api.Features.Geocoder.Point;

internal sealed record Location(string City, string Country, double Latitude, double Longitude);

internal sealed record Response(Location[] Locations);

internal sealed class ResponseMapper : ResponseMapper<Location[],IEnumerable<ResourceSet>>
{
    public override Location[] FromEntity(IEnumerable<ResourceSet> e) =>
        e.SelectMany(t => t.Resources)
            .Take(5)
            .Select(t => new Location(t.Address.Locality, t.Address.CountryRegion, t.Point.Coordinates.Latitude, t.Point.Coordinates.Longitude))
            .ToArray();
}
