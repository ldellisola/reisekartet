using Reisekartet.Api.Mappers;
using Reisekartet.Api.Models;
using Reisekartet.Core.Interfaces;

namespace Reisekartet.Api.Queries;

[QueryType]
public class DestinationQueries
{
    public async Task<IEnumerable<DestinationDto>> GetDestinations([Service] IDestinationsService destinations, CancellationToken token)
    {
        var all = await destinations.GetAll(token);
        return all.Select(DestinationMapper.Map);
    }
}
