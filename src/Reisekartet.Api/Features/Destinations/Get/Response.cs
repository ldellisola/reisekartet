using FastEndpoints;
using Namotion.Reflection;
using Reisekartet.Api.Features.Destinations.GetAllDestinations;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.Get;

internal sealed class Response
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Website { get; init; }
    public string[] Tags { get; init; } = [];
    public string? City { get; init; }
    public string? Country { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string? Description { get; init; }
}

internal sealed class Mapper : ResponseMapper<Response, Destination>
{
    public override Response FromEntity(Destination t) =>
        new Response
        {
            Id = t.Id!,
            Name = t.Name,
            Website = t.Website,
            Tags = t.Tags,
            City = t.City,
            Country = t.Country,
            Latitude = t.Location.Coordinates.Latitude,
            Longitude = t.Location.Coordinates.Longitude,
            Description = t.Description
        };
}
