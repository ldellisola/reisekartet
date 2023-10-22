namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal record Response(DestinationDto[] Destinations);

internal record DestinationDto(string Id, string Name, string? Website, string Type, double Latitude, double Longitude);
