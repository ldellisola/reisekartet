using FastEndpoints;
using Geo.Bing.Abstractions;
using Geo.Bing.Models;
using Geo.Bing.Models.Parameters;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.Features.Destinations.ImportDestinations;

internal sealed record Command(string DestinationId) : ICommand;

internal sealed class CommandHandler(ReisekartetDbContext db, IBingGeocoding geocoder, ILogger<CommandHandler> logger) : ICommandHandler<Command>
{
    public async Task ExecuteAsync(Command command, CancellationToken ct)
    {
        logger.LogInformation("Geocoding destination {@Destination}", new {Id = command.DestinationId});
        var destination = db.Destinations.Find(x => x.Id == command.DestinationId).FirstOrDefault(ct);
        if (destination is null)
            throw new ArgumentException("Destination not found");

        var response = await geocoder.ReverseGeocodingAsync(new ReverseGeocodingParameters
        {
            Point = new Coordinate
            {
                Longitude = destination.Location.Coordinates.Longitude,
                Latitude = destination.Location.Coordinates.Latitude,
            },
            IncludeAddress = true,
        }, ct);

        if (response.StatusCode >= 400)
            throw new InvalidOperationException("Geocoding failed");

        if (response.ResourceSets.Count == 0 | response.ResourceSets.First().Resources.Count == 0)
        {
            logger.LogWarning("Geocoding failed for destination {@Destination}", destination);
            return;
        }

        var resource = response.ResourceSets.First().Resources.First();
        destination.City = resource.Address.Locality;
        destination.Country = resource.Address.CountryRegion;
        destination.Location = new(new(resource.Point.Coordinates.Longitude, resource.Point.Coordinates.Latitude));

        await db.Destinations.ReplaceOneAsync(x => x.Id == destination.Id, destination, cancellationToken: ct);
    }
}
