namespace EconomicDataTracker.Api.ViewModels;

/// <summary>
/// Summary information for a series to display on the dashboard
/// </summary>
public class DashboardSummaryViewModel
{
    public int SeriesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal? LatestValue { get; set; }
    public DateTime? LatestDate { get; set; }
    public decimal? PreviousValue { get; set; }
    public DateTime? PreviousDate { get; set; }
    public decimal? ChangeValue { get; set; }
    public decimal? ChangePercent { get; set; }
}
