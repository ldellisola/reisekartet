using FastEndpoints;
using FluentValidation;

namespace Reisekartet.Api.Features.Geocoder.Address;

internal sealed record Request(string Address);

internal sealed class RequestValidator : Validator<Request>
{
    public RequestValidator()
    {
        RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required")
            .MinimumLength(5).WithMessage("Address must be at least 5 characters long")
            .MaximumLength(100).WithMessage("Address must be at most 100 characters long");
    }
}
