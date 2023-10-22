using FastEndpoints;
using MongoDB.Driver.GeoJsonObjectModel;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.CreateDestination;

internal class Mapper : RequestMapper<Request, Destination>
{
    public override Destination ToEntity(Request r) =>
        new()
        {
            Name = r.Name,
            Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(new GeoJson2DGeographicCoordinates(r.Longitude, r.Latitude)),
            Type = r.Type,
            Website = r.Website,
        };

}