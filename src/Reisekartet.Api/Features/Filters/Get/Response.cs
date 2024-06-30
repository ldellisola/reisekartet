namespace Reisekartet.Api.Features.Filters.Get;

internal sealed record Response(FilterItem[] Filters);

internal enum FilterType
{
    Tag,
    Name,
    City,
    Country,
}

internal sealed record FilterItem(FilterType Type, string Text, string NormalizedText);
