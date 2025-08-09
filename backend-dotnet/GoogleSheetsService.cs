using System.Globalization;
using CsvHelper;
using JiraDashboard.Models;

namespace JiraDashboard.Services;

public class GoogleSheetsService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _sheetId;
    private readonly string _sheetName;

    public GoogleSheetsService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _sheetId = _configuration["GoogleSheets:SheetId"] ?? throw new InvalidOperationException("SheetId not configured");
        _sheetName = _configuration["GoogleSheets:SheetName"] ?? throw new InvalidOperationException("SheetName not configured");
    }

    private string GetCsvUrl() => $"https://docs.google.com/spreadsheets/d/{_sheetId}/gviz/tq?tqx=out:csv&sheet={_sheetName}";

    public async Task<TableSummary> GetSummaryAsync()
    {
        var url = GetCsvUrl();
        using var response = await _httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();

        using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        // Read header to get column info
        await csv.ReadAsync();
        csv.ReadHeader();
        var columns = csv.HeaderRecord.Select(header => new ColumnInfo(header, "string")).ToList(); // Simplified type

        // Count rows
        int rowCount = 0;
        while (await csv.ReadAsync())
        {
            rowCount++;
        }

        return new TableSummary(
            SheetId: _sheetId,
            SheetName: _sheetName,
            TotalRows: rowCount,
            TotalColumns: columns.Count,
            Columns: columns,
            LastUpdated: DateTime.UtcNow
        );
    }
}
