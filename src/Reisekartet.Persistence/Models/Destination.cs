using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Reisekartet.Persistence.Models;

public class Destination
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; }

    public required string[] Tags { get; set; }

    public required string Name { get; set; }

    public string? Website { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }
    public string? Description { get; set; }
}

