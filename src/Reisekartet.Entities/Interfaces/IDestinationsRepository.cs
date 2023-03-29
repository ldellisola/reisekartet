using Reisekartet.Entities.Models;

namespace Reisekartet.Entities.Interfaces;

public interface IDestinationsRepository
{
    public Task Insert(Destination destination, CancellationToken token);
    Task<IEnumerable<Destination>> GetAll(CancellationToken token);
    Task<bool> Delete(string id, CancellationToken token);
}
