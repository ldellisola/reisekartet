using FastEndpoints;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Reisekartet.Api.JobQueue;

internal sealed class JobRecord : IJobStorageRecord
{
    public string QueueID { get; set; } = null!;
    public object Command { get; set; } = null!;
    public DateTime ExecuteAfter { get; set; }
    public DateTime ExpireOn { get; set; }
    public bool IsComplete { get; set; }
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string? Id { get; set; }
}
