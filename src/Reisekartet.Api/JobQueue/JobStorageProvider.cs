using FastEndpoints;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using Reisekartet.Persistence.Config;

namespace Reisekartet.Api.JobQueue;


internal sealed class JobStorageProvider :IJobStorageProvider<JobRecord>
{
    private readonly IMongoDatabase _db;
    private const string CollectionName = "JobQueue";

    public JobStorageProvider(IOptions<DatabaseOptions> mongoDbOptions)
    {
        var options = mongoDbOptions.Value;
        var client = new MongoClient(options.ConnectionString);
        _db = client.GetDatabase(options.Database);

        var objectSerializer = new ObjectSerializer(type => ObjectSerializer.DefaultAllowedTypes(type) || type.FullName!.EndsWith("Command"));

        BsonSerializer.RegisterSerializer(objectSerializer);
    }

    public async Task StoreJobAsync(JobRecord r, CancellationToken ct)
    {
        await _db.GetCollection<JobRecord>(CollectionName).InsertOneAsync(r, cancellationToken: ct);
    }

    public async Task<IEnumerable<JobRecord>> GetNextBatchAsync(PendingJobSearchParams<JobRecord> parameters)
    {
        var query = await _db.GetCollection<JobRecord>(CollectionName)
            .FindAsync(
                parameters.Match,
                new FindOptions<JobRecord> { Limit = parameters.Limit, },
                cancellationToken: parameters.CancellationToken
                );

        return await query.ToListAsync(parameters.CancellationToken);
    }

    public async Task MarkJobAsCompleteAsync(JobRecord r, CancellationToken ct)
    {
        var filter = Builders<JobRecord>.Filter.Eq(t => t.Id, r.Id);
        var update = Builders<JobRecord>.Update.Set(t => t.IsComplete, true);

        await _db.GetCollection<JobRecord>(CollectionName)
            .UpdateOneAsync(filter,update , cancellationToken: ct);
    }

    public async Task OnHandlerExecutionFailureAsync(JobRecord r, Exception exception, CancellationToken ct)
    {
        var filter = Builders<JobRecord>.Filter.Eq(t => t.Id, r.Id);
        var update = Builders<JobRecord>.Update.Set(t => t.ExecuteAfter, DateTime.UtcNow.AddMinutes(1));

        await _db.GetCollection<JobRecord>(CollectionName)
            .UpdateOneAsync(filter,update , cancellationToken: ct);
    }

    public async Task PurgeStaleJobsAsync(StaleJobSearchParams<JobRecord> parameters)
    {
        await _db.GetCollection<JobRecord>(CollectionName)
            .DeleteManyAsync(parameters.Match , cancellationToken: parameters.CancellationToken);
    }
}
