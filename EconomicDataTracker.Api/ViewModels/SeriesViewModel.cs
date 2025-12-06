namespace EconomicDataTracker.Api.ViewModels;

/// <summary>
/// Represents a FRED economic series
/// </summary>
public class SeriesViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Enabled { get; set; }
    public DateTime? LastUpdated { get; set; }
    public int ObservationCount { get; set; }
}
