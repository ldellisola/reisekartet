using FastEndpoints;
using MongoDB.Driver.GeoJsonObjectModel;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Destinations.ImportDestinations;

internal sealed class Endpoint(ReisekartetDbContext db) : Endpoint<Request>
{
    public override void Configure()
    {
        Post("/destinations/bulk");
        AllowAnonymous();
        AllowFileUploads();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        if (Files.Count == 0)
            AddError("No file uploaded");
        if (Files.Count > 1)
            AddError("Only one file can be uploaded at a time");

        if (req.KmlFile.ContentType != "application/vnd.google-earth.kml" && req.KmlFile.ContentType != "application/vnd.google-earth.kml+xml")
            AddError("Only KML files are supported");

        ThrowIfAnyErrors();

        var places = Kml.ParseKlm(req.KmlFile.OpenReadStream())
            .SelectMany(t=> t.Value.Select(d => new Destination
            {
                Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(new GeoJson2DGeographicCoordinates(d.Longitude, d.Latitude)),
                Tags = new[]
                {
                    t.Key
                },
                Name = d.Name,
                Website = null,
                City = null,
                Country = null,
                Description = null
            }))
            .ToArray();

        await db.Destinations.InsertManyAsync(places, cancellationToken: ct);

        foreach (var place in places)
        {
            await new Command(place.Id!).QueueJobAsync(ct: ct);
        }

        await SendNoContentAsync(ct);
    }
}
