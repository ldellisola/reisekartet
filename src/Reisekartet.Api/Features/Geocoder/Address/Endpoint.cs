using FastEndpoints;
using Geo.Bing.Abstractions;
using Geo.Bing.Models.Parameters;

namespace Reisekartet.Api.Features.Geocoder.Address;

internal sealed class Endpoint : Endpoint<Request,Response, ResponseMapper>
{
    private readonly IBingGeocoding _geocoder;

    public Endpoint(IBingGeocoding geocoder)
    {
        _geocoder = geocoder;
    }

    public override void Configure()
    {
        Get("/geocoder/address");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var response = await   _geocoder.AddressGeocodingAsync(new AddressGeocodingParameters
        {
            AddressLine = req.Address,
            IncludeQueryParse = true,
            MaximumResults = 5,
        }, ct);

        if (response.StatusCode > 400)
        {
            foreach (var error in response.ErrorDetails)
                AddError(error);

            await SendErrorsAsync(response.StatusCode, ct);
            return;
        }

        await SendOkAsync(new(Map.FromEntity(response.ResourceSets)), ct);
    }
}
