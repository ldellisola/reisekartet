using Reisekartet.Entities.Config;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    });

builder.Services.AddAuthorization();

// builder.Services.AddReisekartetDbContext();

builder.Services.AddGraphQLServer()
    .AddQueryType()
    .AddAuthorization()
    .AddApiTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .InitializeOnStartup()
    ;

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// app.RunMigrations();

app.MapGraphQL("/api/graphql");

app.MapFallbackToFile("index.html");

app.Run();
