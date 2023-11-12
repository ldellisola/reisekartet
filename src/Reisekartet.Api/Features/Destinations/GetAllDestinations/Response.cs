namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal sealed record Response(DestinationDto[] Destinations);

internal sealed record DestinationDto(string Id, string Name, string? Website, string Type, double Latitude, double Longitude);
