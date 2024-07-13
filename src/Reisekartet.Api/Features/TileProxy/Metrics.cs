using System.Diagnostics.Metrics;

namespace Reisekartet.Api.Features.TileProxy;

internal sealed class Metrics
{
    private readonly Counter<int> _cacheHit;
    private readonly Counter<int> _cacheMissed;

    public Metrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("Reisekartet.Api.TileProxy");
        _cacheHit = meter.CreateCounter<int>("tile_proxy.cache_hit");
        _cacheMissed = meter.CreateCounter<int>("tile_proxy.cache_missed");
    }

    public void CacheHit() => _cacheHit.Add(1);
    public void CacheMissed() => _cacheMissed.Add(1);
}
