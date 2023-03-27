using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Reisekartet.Entities.Config;

/// <summary>
/// A set of options for the database.
/// </summary>
public sealed class DatabaseOptions
{
    /// <summary>
    /// A set of options for the database.
    /// </summary>
    /// <param name="ConnectionString">The database connection string</param>
    /// <param name="EnableDetailedErrors">Whether the database will log errors with extra information.</param>
    /// <param name="EnableSensitiveDataLogging">Whether the database will show sensitive data in the logs</param>
    public DatabaseOptions(string ConnectionString,bool EnableDetailedErrors, bool EnableSensitiveDataLogging)
    {
        this.ConnectionString = ConnectionString;
        this.EnableDetailedErrors = EnableDetailedErrors;
        this.EnableSensitiveDataLogging = EnableSensitiveDataLogging;
    }

    public DatabaseOptions(){}

    /// <summary>The database connection string</summary>
    public string ConnectionString { get; set; } = string.Empty;

    /// <summary>Whether the database will log errors with extra information.</summary>
    public bool EnableDetailedErrors { get; init; }

    /// <summary>Whether the database will show sensitive data in the logs</summary>
    public bool EnableSensitiveDataLogging { get; init; }

}

public sealed class DatabaseOptionsSetup : IConfigureOptions<DatabaseOptions>
{
    private readonly IConfiguration _configuration;
    private const string SectionName = "DatabaseOptions";
    private const string ConnectionStringName = "Database";

    public DatabaseOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(DatabaseOptions options)
    {
        var connectionString = _configuration.GetConnectionString(ConnectionStringName);
        ArgumentException.ThrowIfNullOrEmpty(connectionString);

        options.ConnectionString = connectionString ;
        _configuration.GetSection(SectionName).Bind(options);
    }
}
