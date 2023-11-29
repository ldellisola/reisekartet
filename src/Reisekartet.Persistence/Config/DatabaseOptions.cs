using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Reisekartet.Persistence.Config;

/// <summary>
/// A set of options for the database.
/// </summary>
public sealed class DatabaseOptions
{

    public DatabaseOptions(){}

    /// <summary>The database connection string</summary>
    public string ConnectionString { get; set; } = string.Empty;

    /// <summary>The mongoDb database to use.</summary>
    public string Database { get; init; } = "Reisekartet";


}

public sealed class DatabaseOptionsSetup(IConfiguration configuration) : IConfigureOptions<DatabaseOptions>
{
    private const string ConnectionStringName = "Mongo";

    public void Configure(DatabaseOptions options)
    {
        var connectionString = configuration.GetConnectionString(ConnectionStringName);

        options.ConnectionString = configuration.GetValue<string?>("MONGO_CONNECTION_STRING")
                                   ?? connectionString
                                   ?? throw new ArgumentNullException(connectionString);
    }
}
