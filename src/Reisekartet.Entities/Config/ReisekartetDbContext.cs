using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Reisekartet.Entities.Models;

namespace Reisekartet.Entities.Config;

public class ReisekartetDbContext
{
    private readonly IMongoDatabase _db;

    public ReisekartetDbContext(IOptions<DatabaseOptions> mongoDbOptions)
    {
        var options = mongoDbOptions.Value;
        var client = new MongoClient(options.ConnectionString);
        _db = client.GetDatabase(options.Database);
    }

    internal IMongoCollection<Destination> Destinations => _db.GetCollection<Destination>("Destinations");

}
