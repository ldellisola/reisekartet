using Reisekartet.Core.Config;
using Reisekartet.Entities.Config;

var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//     .AddCookie(options =>
//     {
//         options.SlidingExpiration = true;
//         options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
//     });

// builder.Services.AddAuthorization();

builder.Services.AddReisekartetDbContext();
builder.Services.AddCoreServices();

builder.Services.AddGraphQLServer()
    .AddQueryType()
    // .AddAuthorization()
    .AddApiTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .InitializeOnStartup()
    .AddMutationConventions()
    ;

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

// app.UseAuthentication();
// app.UseAuthorization();

//

app.MapGraphQL("/api/graphql");

app.MapFallbackToFile("index.html");

app.Run();
