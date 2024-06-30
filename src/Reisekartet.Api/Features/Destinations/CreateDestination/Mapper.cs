using FastEndpoints;
using MongoDB.Driver.GeoJsonObjectModel;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.CreateDestination;

internal sealed class Mapper : RequestMapper<Request, Destination>
{
    public override Destination ToEntity(Request r) =>
        new()
        {
            Name = r.Name.Trim(),
            Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(new GeoJson2DGeographicCoordinates(r.Longitude, r.Latitude)),
            Tags = r.Tags.Select(t => t.Trim()).ToArray(),
            Website = string.IsNullOrWhiteSpace(r.Website) ? null : r.Website.Trim(),
            City = string.IsNullOrWhiteSpace(r.City) ? null : r.City.Trim(),
            Country = string.IsNullOrWhiteSpace(r.Country) ? null : r.Country.Trim(),
            Description = string.IsNullOrWhiteSpace(r.Description) ? null : r.Description
        };

}
