using FastEndpoints;
using Microsoft.Extensions.Options;
using Reisekartet.Api.Configuration;

namespace Reisekartet.Api.Features.Configuration;

internal class Endpoint(IOptions<MapsConfiguration> configuration) : EndpointWithoutRequest<Response, ResponseMapper>
{
    public override void Configure()
    {
        Get("/configuration");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await SendAsync(Map.FromEntity(configuration.Value), cancellation: ct);
    }
}
