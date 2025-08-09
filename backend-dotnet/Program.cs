using JiraDashboard.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient<GoogleSheetsService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapGet("/api/table/summary", async (GoogleSheetsService sheetsService) => 
{
    try
    {
        return Results.Ok(await sheetsService.GetSummaryAsync());
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
