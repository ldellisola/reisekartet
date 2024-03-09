using System.Globalization;
using System.Text;
using FastEndpoints;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Api.Features.Filters.Get;

internal sealed class Endpoint(ReisekartetDbContext db) : EndpointWithoutRequest<Response>
{
    public override void Configure()
    {
        Get("/filters");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var cursor = await db.Destinations.FindAsync(Builders<Destination>.Filter.Empty, cancellationToken: cancellationToken);
        var destinations = await cursor.ToListAsync(cancellationToken);
        var tags = destinations.SelectMany(d => d.Tags).Distinct().Select(t => new FilterItem(FilterType.Tag, t, Normalize(t)));
        var cities = destinations.Select(d => d.City).OfType<string>().Distinct().Select(c => new FilterItem(FilterType.City, c, Normalize(c)));
        var countries = destinations.Select(d => d.Country).OfType<string>().Distinct().Select(c => new FilterItem(FilterType.Country, c, Normalize(c)));
        var names = destinations.Select(d => d.Name).Distinct().Select(n => new FilterItem(FilterType.Name, n, Normalize(n)));

        await SendOkAsync(new Response(tags.Concat(cities).Concat(countries).Concat(names).ToArray()), cancellationToken);
    }


    private static readonly Encoding Encoding = Encoding.GetEncoding("ISO-8859-8");
    private static string Normalize(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        StringBuilder stringBuilder = new StringBuilder();

        for (var i = 0; i < normalized.Length; i++)
        {
            var c = normalized[i];
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(char.ToLowerInvariant(c));
            }
        }
        var bytes = Encoding.GetBytes(stringBuilder.ToString());
        return Encoding.UTF8.GetString(bytes).Normalize(NormalizationForm.FormC);
    }
}
