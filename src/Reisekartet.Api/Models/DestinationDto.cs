using Reisekartet.Entities.Models;

namespace Reisekartet.Api.Models;

public class DestinationDto
{
    public string? Id { get; set; }

    public required Point Location { get; set; }

    public required DestinationType Type { get; set; }

    public required string Name { get; set; }

    public required string Website { get; set; }
}
