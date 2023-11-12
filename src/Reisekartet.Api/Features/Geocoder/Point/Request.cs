using FastEndpoints;
using FluentValidation;

namespace Reisekartet.Api.Features.Geocoder.Point;

internal sealed record Request(double Latitude, double Longitude);

internal sealed class RequestValidator : Validator<Request>
{
    public RequestValidator()
    {
        RuleFor(x => x.Latitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.Longitude).InclusiveBetween(-180, 180);
    }
}
