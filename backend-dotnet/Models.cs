using System.Text.Json.Serialization;

namespace JiraDashboard.Models;

// Represents information about a single column in the table
public record ColumnInfo(string Name, string Type);

// Represents the response for the /api/table/summary endpoint
public record TableSummary(
    string SheetId,
    string SheetName,
    int TotalRows,
    int TotalColumns,
    List<ColumnInfo> Columns,
    DateTime LastUpdated
);

// Represents pagination information for the data table
public record PaginationInfo(
    int CurrentPage,
    int PageSize,
    int TotalPages,
    int TotalRecords,
    bool HasNext,
    bool HasPrev
);

// Represents the main response for the /api/table/data endpoint
public record TableDataResponse(
    [property: JsonPropertyName("data")] List<Dictionary<string, object?>> Data,
    [property: JsonPropertyName("pagination")] PaginationInfo Pagination
);

// Dashboard MVP Models
public record DashboardStats(
    [property: JsonPropertyName("total_issues")] int TotalIssues,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("done_issues")] int DoneIssues,
    [property: JsonPropertyName("done_story_points")] double DoneStoryPoints,
    [property: JsonPropertyName("last_updated")] DateTime LastUpdated
);

public record StatusDistributionItem(
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("count")] int Count,
    [property: JsonPropertyName("percentage")] double Percentage
);

public record StatusDistribution(
    [property: JsonPropertyName("distribution")] List<StatusDistributionItem> Distribution,
    [property: JsonPropertyName("total_count")] int TotalCount,
    [property: JsonPropertyName("last_updated")] DateTime LastUpdated
);

// Configuration Models
public record UpdateSheetConfigRequest(
    [property: JsonPropertyName("google_sheet_url")] string GoogleSheetUrl
);

public record UpdateSheetConfigResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("message")] string Message,
    [property: JsonPropertyName("sheet_id")] string? SheetId
);

public record SheetConfigInfo(
    [property: JsonPropertyName("sheet_id")] string SheetId,
    [property: JsonPropertyName("sheet_url")] string SheetUrl
);
