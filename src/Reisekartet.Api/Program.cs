using FastEndpoints;
using FastEndpoints.ClientGen;
using FastEndpoints.Swagger;
using Reisekartet.Persistence.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddFastEndpoints(t=> t.SourceGeneratorDiscoveredTypes.AddRange(Reisekartet.Api.DiscoveredTypes.All))
    .SwaggerDocument();
builder.Services.AddReisekartetDbContext();

var app = builder.Build();

app
    .UseFastEndpoints(t=> t.Endpoints.RoutePrefix = "api")
    .UseDefaultExceptionHandler()
    .UseSwaggerGen();

app.MapFallbackToFile("index.html");

app.Run();
