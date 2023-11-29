using FastEndpoints;
using MongoDB.Driver.GeoJsonObjectModel;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.EditDestination;

internal sealed class Mapper : RequestMapper<Request, Destination>
{
    public override Destination ToEntity(Request r) =>
        new()
        {
            Name = r.Name,
            Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(new GeoJson2DGeographicCoordinates(r.Longitude, r.Latitude)),
            Tags = r.Tags,
            Website = r.Website,
            City = r.City,
            Country = r.Country,
            Description = string.IsNullOrWhiteSpace(r.Description) ? null : r.Description,
            Id = r.Id
        };

}
