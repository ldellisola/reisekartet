using Microsoft.AspNetCore.Mvc;

namespace Reisekartet.Api.Features.Destinations.Get;

internal sealed class Request
{
    [FromRoute]
    public string Id { get; set; } = string.Empty;
}
