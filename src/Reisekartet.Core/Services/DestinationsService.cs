using Reisekartet.Core.Interfaces;
using Reisekartet.Entities.Interfaces;
using Reisekartet.Entities.Models;

namespace Reisekartet.Core.Services;

public class DestinationsService : IDestinationsService
{
    private readonly IDestinationsRepository _destinations;
    public DestinationsService(IDestinationsRepository destinations)
    {
        _destinations = destinations;
    }
    public async Task CreateDestination(Destination destination, CancellationToken token)
    {
        await _destinations.Insert(destination, token);
    }
    public async Task<IEnumerable<Destination>> GetAll(CancellationToken token)
    {
        return await _destinations.GetAll(token);
    }
    public async Task<bool> DeleteDestination(string id, CancellationToken token)
    {
        return await _destinations.Delete(id, token);
    }
}
