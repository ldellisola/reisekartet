using Reisekartet.Api.Mappers;
using Reisekartet.Api.Models;
using Reisekartet.Core.Interfaces;
using Reisekartet.Entities.Models;

namespace Reisekartet.Api.Mutations;

public record CreateDestinationInput(string Name, string Website, DestinationType Type, Point Location);

[MutationType]
public partial class DestinationMutations
{
    public async Task<MutationResult<DestinationDto>> CreateDestination([Service] IDestinationsService destinations, CreateDestinationInput input, CancellationToken token)
    {
        var destination = input.Map();
        await destinations.CreateDestination(destination, token);
        return destination.Map();
    }
}
