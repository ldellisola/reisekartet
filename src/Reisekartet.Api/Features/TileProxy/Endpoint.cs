using System.Diagnostics.Metrics;
using FastEndpoints;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Reisekartet.Api.Configuration;

namespace Reisekartet.Api.Features.TileProxy;

internal sealed class Endpoint(IHttpClientFactory clientFactory, IDistributedCache cache, IOptions<MapsConfiguration> mapOptions, IMeterFactory meterFactory) : Endpoint<Request>
{
    private readonly DistributedCacheEntryOptions _cacheOptions = new DistributedCacheEntryOptions()
        .SetSlidingExpiration(mapOptions.Value.CacheDuration!.Value);

    private readonly Metrics _metrics = new(meterFactory);

    public override void Configure()
    {
        Get("/tiles/{z}/{x}/{y}.png");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        if (mapOptions.Value.TileServer is null)
        {
            await SendAsync(null, statusCode: 404, cancellation: ct);
            return;
        }

        var path = mapOptions.Value.TileServer
            .Replace("{x}", req.X)
            .Replace("{y}", req.Y)
            .Replace("{z}", req.Z);

        if (mapOptions.Value.UseCache && await cache.GetAsync(path, ct) is {} existingTile)
        {
            _metrics.CacheHit();
            Logger.LogDebug("Cache hit for {Path}", path);
            await SendBytesAsync(existingTile, contentType: "image/png", cancellation: ct);
            return;
        }

        var client = clientFactory.CreateClient("tileproxy");
        var result = await client.GetAsync(path, ct);
        if (!result.IsSuccessStatusCode)
        {
            await SendAsync(await result.Content.ReadAsStreamAsync(ct), statusCode: (int)result.StatusCode, cancellation: ct);
            return;
        }
        var tile = await result.Content.ReadAsByteArrayAsync(ct);
        if (mapOptions.Value.UseCache)
        {
            _metrics.CacheMissed();
            await cache.SetAsync(path, tile, _cacheOptions, ct);
        }

        await SendBytesAsync(tile, contentType: "image/png", cancellation: ct);
    }
}
