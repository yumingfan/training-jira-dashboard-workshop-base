using JiraDashboard.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient<GoogleSheetsService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Use CORS
app.UseCors();

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
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var result = await sheetsService.GetPaginatedDataAsync(page, pageSize, sortBy, sortOrder, sprint);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/api/table/sprints", async (GoogleSheetsService sheetsService) => 
{
    try
    {
        var sprints = await sheetsService.GetSprintOptionsAsync();
        return Results.Ok(new { sprints });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// Dashboard MVP API endpoints
app.MapGet("/api/dashboard/stats", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var stats = await sheetsService.GetDashboardStatsAsync(sprint);
        return Results.Ok(stats);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/api/dashboard/status-distribution", async (
    [FromServices] GoogleSheetsService sheetsService,
    [FromQuery] string? sprint = null) =>
{
    try
    {
        var distribution = await sheetsService.GetStatusDistributionAsync(sprint);
        return Results.Ok(distribution);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();

// 讓測試可以存取 Program 類別
public partial class Program { }
