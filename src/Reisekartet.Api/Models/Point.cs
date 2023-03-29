using MongoDB.Driver.GeoJsonObjectModel;

namespace Reisekartet.Api.Models;

public class Point
{
    public Point(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public double Latitude { get; set; }
    public double Longitude { get; set; }


    public static implicit operator GeoJsonPoint<GeoJson2DGeographicCoordinates>(Point point)
    {
        return new GeoJsonPoint<GeoJson2DGeographicCoordinates>(new GeoJson2DGeographicCoordinates(point.Longitude, point.Latitude));
    }

    public static implicit operator Point(GeoJsonPoint<GeoJson2DGeographicCoordinates> coordinates)
    {
        return new Point(coordinates.Coordinates.Latitude, coordinates.Coordinates.Longitude);
    }
}
