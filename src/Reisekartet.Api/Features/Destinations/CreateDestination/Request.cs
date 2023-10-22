using FastEndpoints;
using FluentValidation;

namespace Reisekartet.Api.Features.Destinations.CreateDestination;

internal record Request(
     string Name,
    string? Website,
   string Type,
    double Latitude,
    double Longitude
);

internal class RequestValidator : Validator<Request>
{
    public RequestValidator()
    {
        RuleFor(t => t.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MinimumLength(3)
            .WithMessage("Name must be at least 3 characters long")
            .MaximumLength(200)
            .WithMessage("Name must be at most 200 characters long");

        RuleFor(t => t.Website)
            .MaximumLength(200)
            .WithMessage("Website must be at most 200 characters long")
            .Matches(@"^https?://")
            .WithMessage("Website must be a valid URL");

        RuleFor(t => t.Type)
            .NotEmpty()
            .WithMessage("Type is required")
            .MaximumLength(200)
            .WithMessage("Type must be at most 200 characters long");

        RuleFor(t => t.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90");

        RuleFor(t => t.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180");
    }
}

