using FastEndpoints;
using FastEndpoints.Swagger;
using Geo.Bing.DependencyInjection;
using Reisekartet.Api.JobQueue;
using Reisekartet.Persistence.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddBingServices(t => t.UseKey(builder.Configuration.GetValue<string>("Geocoder:BingMapsKey")));
builder.Services
    .AddFastEndpoints(t=> t.SourceGeneratorDiscoveredTypes.AddRange(Reisekartet.Api.DiscoveredTypes.All))
    .AddJobQueues<JobRecord,JobStorageProvider>()
    .SwaggerDocument();

builder.Services.AddReisekartetDbContext();

var app = builder.Build();

app
    .UseFastEndpoints(t=> t.Endpoints.RoutePrefix = "api")
    .UseJobQueues(t=> t.MaxConcurrency = 1)
    .UseDefaultExceptionHandler()
    .UseSwaggerGen();

app.MapFallbackToFile("index.html");

app.Run();
