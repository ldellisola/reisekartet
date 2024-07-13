using System.Text;
using System.Text.Json.Serialization;
using FastEndpoints;
using FastEndpoints.Swagger;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using Reisekartet.Api.Configuration;
using Reisekartet.Api.JobQueue;
using Reisekartet.Persistence.Config;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGeocoder(builder.Configuration);
builder.Services.ConfigureOptions<MapsConfigurationSetup>();
builder.Services
    .AddFastEndpoints(t=> t.SourceGeneratorDiscoveredTypes.AddRange(Reisekartet.Api.DiscoveredTypes.All))
    .AddJobQueues<JobRecord,JobStorageProvider>()
    .SwaggerDocument();

builder.Services.AddTileProxy(builder.Configuration);

builder.Services.AddReisekartetDbContext();

builder.Services.AddOpenTelemetry()
    .WithMetrics(t => t
        .AddMeter("Reisekartet.Api")
        .AddOtlpExporter(r =>
        {
            r.Protocol = OtlpExportProtocol.Grpc;
            r.Endpoint = new Uri(builder.Configuration.GetConnectionString("Otlp")!);
        })
    );
var app = builder.Build();

app
    .UseFastEndpoints(t=>
    {
        t.Serializer.Options.Converters.Add(new JsonStringEnumConverter<Reisekartet.Api.Features.Filters.Get.FilterType>());
        t.Serializer.Options.Converters.Add(new JsonStringEnumConverter<Reisekartet.Api.Features.Destinations.GetAllDestinations.FilterType>());
        t.Endpoints.RoutePrefix = "api";
    })
    .UseJobQueues(t=> t.MaxConcurrency = 1)
    .UseDefaultExceptionHandler()
    .UseSwaggerGen();

app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
