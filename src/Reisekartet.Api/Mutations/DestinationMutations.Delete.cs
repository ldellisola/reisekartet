using Reisekartet.Core.Interfaces;

namespace Reisekartet.Api.Mutations;

public partial class DestinationMutations
{

    public async Task<MutationResult<bool>> DeleteDestination([Service] IDestinationsService destinations, string id, CancellationToken token)
    {
        return await destinations.DeleteDestination(id, token);
    }
}
