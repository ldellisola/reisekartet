using MongoDB.Driver;
using Reisekartet.Entities.Config;
using Reisekartet.Entities.Interfaces;
using Reisekartet.Entities.Models;

namespace Reisekartet.Entities.Repositories;

public class DestinationsRepository : IDestinationsRepository
{
    private readonly IMongoCollection<Destination> _destinations;

    public DestinationsRepository(ReisekartetDbContext context)
    {
        _destinations = context.Destinations;
    }
    public async Task Insert(Destination destination, CancellationToken token)
    {
        await _destinations.InsertOneAsync(destination,null, token);
    }
    public async Task<IEnumerable<Destination>> GetAll(CancellationToken token)
    {
        return await _destinations.Find(_ => true).ToListAsync(token);
    }
    public async Task<bool> Delete(string id, CancellationToken token)
    {
        var filter = Builders<Destination>.Filter.Eq(t=> t.Id, id);
        var result = await _destinations.DeleteOneAsync(filter, token);
        return result.DeletedCount is 1;
    }
}
