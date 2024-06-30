using FastEndpoints;
using Geo.Bing.Abstractions;
using Geo.Bing.Models.Parameters;

namespace Reisekartet.Api.Features.Geocoder.Address;

internal sealed class Endpoint(IBingGeocoding geocoder) : Endpoint<Request,Response, ResponseMapper>
{
    public override void Configure()
    {
        Get("/geocoder/address");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var response = await   geocoder.AddressGeocodingAsync(new AddressGeocodingParameters
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
