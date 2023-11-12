using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Reisekartet.Persistence.Config;

/// <summary>
/// A set of options for the database.
/// </summary>
public sealed class DatabaseOptions
{
    /// <summary>
    /// A set of options for the database.
    /// </summary>
    /// <param name="connectionString">The database connection string</param>
    /// <param name="database">The mongoDb database to use.</param>
    public DatabaseOptions(string connectionString, string database)
    {
        this.ConnectionString = connectionString;
        this.Database = database;
    }

#pragma warning disable CS8618
    public DatabaseOptions(){}
#pragma warning restore CS8618

    /// <summary>The database connection string</summary>
    public string ConnectionString { get; set; } = string.Empty;

    /// <summary>The mongoDb database to use.</summary>
    public string Database { get; init; }


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
