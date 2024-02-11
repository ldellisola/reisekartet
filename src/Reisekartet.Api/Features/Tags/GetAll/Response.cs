
namespace Reisekartet.Api.Features.Tags.GetAll;

internal sealed record Response(TagDto[] Tags);

internal record TagDto(string Name);
