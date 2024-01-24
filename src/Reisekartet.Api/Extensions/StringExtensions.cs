using SharpCompress.Common;

namespace Reisekartet.Api.Extensions;

public static class StringExtensions
{
    public static TimeSpan ToTimeSpan(this string duration)
    {
        var parts = duration.AsSpan();

        var days = 0;
        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        var index = parts.IndexOf('d');
        if (index != -1)
        {
            days = int.Parse(parts[..index]);
            parts = parts[(index + 1)..];
        }

        index = parts.IndexOf('h');
        if (index != -1)
        {
            hours = int.Parse(parts[..index]);
            parts = parts[(index + 1)..];
        }

        index = parts.IndexOf('m');

        if (index != -1)
        {
            minutes = int.Parse(parts[..index]);
            parts = parts[(index + 1)..];
        }

        index = parts.IndexOf('s');
        if (index != -1)
        {
            seconds = int.Parse(parts[..index]);
            parts = parts[(index + 1)..];
        }

        if (parts.Length > 0)
            throw new InvalidFormatException("Invalid duration format");

        return new TimeSpan(days, hours, minutes, seconds);
    }
}
