namespace EconomicDataTracker.Api.ViewModels;

/// <summary>
/// Represents a single observation (data point) for an economic series
/// </summary>
public class ObservationViewModel
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Value { get; set; }
    public int SeriesId { get; set; }
    public string SeriesName { get; set; } = string.Empty;
    public string SeriesDescription { get; set; } = string.Empty;
}
