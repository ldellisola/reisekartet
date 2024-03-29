using FastEndpoints;
using FluentValidation;
using MongoDB.Bson;

namespace Reisekartet.Api.Features.Destinations.DeleteDestination;

internal sealed record Request(string Id);

internal sealed class RequestValidator : Validator<Request>
{
    public RequestValidator()
    {
        RuleFor(t => t.Id)
            .NotEmpty()
            .WithMessage("Id is required")
            .Must(t => ObjectId.TryParse(t, out _))
            .WithMessage("Id must be a valid ObjectId");
    }
}
