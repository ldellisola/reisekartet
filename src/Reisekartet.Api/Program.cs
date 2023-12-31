using FastEndpoints;
using FastEndpoints.Swagger;
using Reisekartet.Api.Configuration;
using Reisekartet.Api.JobQueue;
using Reisekartet.Persistence.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGeocoder(builder.Configuration);
builder.Services.ConfigureOptions<MapsConfigurationSetup>();
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

app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
