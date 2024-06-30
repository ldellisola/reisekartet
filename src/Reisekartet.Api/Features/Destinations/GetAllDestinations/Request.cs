using Microsoft.AspNetCore.Mvc;

namespace Reisekartet.Api.Features.Destinations.GetAllDestinations;

internal sealed class Request
{
    [FromQuery]
    public required FilterItem[] Filters { get; init; }
}

internal enum FilterType
{
    Tag,
    Name,
    City,
    Country,
}
internal sealed record FilterItem(FilterType Type, string Text);
