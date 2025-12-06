namespace EconomicDataTracker.Api.ViewModels;

/// <summary>
/// Represents a series with its observations
/// </summary>
public class SeriesWithObservationsViewModel
{
    public SeriesViewModel Series { get; set; } = new();
    public List<ObservationViewModel> Observations { get; set; } = new();
}
