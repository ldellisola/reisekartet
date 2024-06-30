using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Reisekartet.Persistence.Models;

namespace Reisekartet.Persistence.Config;

public class ReisekartetDbContext
{
    private readonly IMongoDatabase _db;

    public ReisekartetDbContext(IOptions<DatabaseOptions> mongoDbOptions)
    {
        var options = mongoDbOptions.Value;
        var client = new MongoClient(options.ConnectionString);
        _db = client.GetDatabase(options.Database);
    }

    public IMongoCollection<Destination> Destinations => _db.GetCollection<Destination>("Destinations");

}
