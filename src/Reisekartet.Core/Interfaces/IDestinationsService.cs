using Reisekartet.Entities.Models;

namespace Reisekartet.Core.Interfaces;

public interface IDestinationsService
{
    public Task CreateDestination(Destination destination, CancellationToken token);
    public Task<IEnumerable<Destination>> GetAll(CancellationToken token);
    public Task<bool> DeleteDestination(string id, CancellationToken token);
}
