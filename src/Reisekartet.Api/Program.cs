using FastEndpoints;
using FastEndpoints.Swagger;
using Geo.Bing.DependencyInjection;
using Reisekartet.Persistence.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddBingServices(t => t.UseKey(builder.Configuration.GetValue<string>("Geocoder:BingMapsKey")));
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
