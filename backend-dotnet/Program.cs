using JiraDashboard.Services;
using Microsoft.AspNetCore.Mvc;

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

app.MapGet("/api/table/data", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] int page = 1,
    [FromQuery(Name = "page_size")] int pageSize = 100,
    [FromQuery(Name = "sort_by")] string sortBy = "key",
    [FromQuery(Name = "sort_order")] string sortOrder = "asc",
    [FromQuery] string? search = null,
    [FromQuery] string? status = null,
    [FromQuery] string? priority = null) =>
{
    try
    {
        var result = await sheetsService.GetPaginatedDataAsync(page, pageSize, sortBy, sortOrder, search, status, priority);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
