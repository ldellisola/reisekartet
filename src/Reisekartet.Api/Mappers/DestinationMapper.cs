using Reisekartet.Api.Models;
using Reisekartet.Api.Mutations;
using Reisekartet.Entities.Models;
using Riok.Mapperly.Abstractions;

namespace Reisekartet.Api.Mappers;

[Mapper]
public static partial class DestinationMapper
{
    public static partial Destination Map(this CreateDestinationInput input);
    public static partial DestinationDto Map(this Destination input);
}

