namespace EconomicDataTracker.Api.ViewModels;

/// <summary>
/// Request model for filtering observations
/// </summary>
public class ObservationFilterRequest
{
    public List<int>? SeriesIds { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Limit { get; set; }
    public string? SortBy { get; set; } = "date";
    public string? SortOrder { get; set; } = "asc";
}
