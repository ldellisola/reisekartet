using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Reisekartet.Api.Features.Destinations.EditDestination;

internal sealed record Request(
     [FromRoute] string Id,
     string Name,
     string? Website,
     string[] Tags,
     double Latitude,
     double Longitude,
     string? City,
     string? Country,
     string? Description
);

internal sealed class RequestValidator : Validator<Request>
{
    public RequestValidator()
    {
        RuleFor(t => t.Id)
            .NotEmpty()
            .WithMessage("Id is required");
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

        RuleFor(t => t.Tags)
            .NotEmpty()
            .WithMessage("Tags are required")
            .ForEach(t =>
                t.NotEmpty()
                    .WithMessage("Tag cannot be empty")
                    .MinimumLength(2)
                    .WithMessage("Tag must be at least 3 characters long")
                    .MaximumLength(50)
                    .WithMessage("Tag must be at most 50 characters long")
            );

        RuleFor(t => t.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90");

        RuleFor(t => t.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180");

        RuleFor(t=> t.City)
            .MaximumLength(200).WithMessage("City must be at most 200 characters long");

        RuleFor(t=> t.Country)
            .MaximumLength(200).WithMessage("Country must be at most 200 characters long");

        RuleFor(t => t.Description)
            .MaximumLength(500).WithMessage("Description must be at most 500 characters long");
    }
}

