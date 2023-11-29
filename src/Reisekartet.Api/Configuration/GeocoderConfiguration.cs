using Geo.Bing.DependencyInjection;

namespace Reisekartet.Api.Configuration;

internal static class GeocoderConfiguration
{
    internal static IServiceCollection AddGeocoder(this IServiceCollection services, IConfiguration configuration)
    {
        var options = new GeocoderOptions(configuration);

        if (options.BingMapsKey is not null)
            services.AddBingServices(t => t.UseKey(options.BingMapsKey));


        if (!options.HasGeoCoder)
            throw new ArgumentException("No geocoder configured.");

        return services;
    }
}

internal class GeocoderOptions
{
    internal GeocoderOptions(IConfiguration configuration)
    {
        BingMapsKey = configuration.GetValue<string>("BING_MAPS_KEY") ?? configuration.GetValue<string>("Geocoder:BingMapsKey");
    }

    internal string? BingMapsKey { get; set; }

    public bool HasGeoCoder => !string.IsNullOrWhiteSpace(BingMapsKey);
}
