using EconomicDataTracker.Api.ViewModels;
using EconomicDataTracker.Entities.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EconomicDataTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IUnitOfWork unitOfWork, ILogger<DashboardController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard summary for all enabled series
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<DashboardSummaryViewModel>>> GetSummary([FromQuery] bool? enabledOnly = true)
    {
        try
        {
            var series = await _unitOfWork.FredSeriesRepository.GetAllAsync();

            if (enabledOnly == true)
            {
                series = series.Where(s => s.Enabled).ToList();
            }

            var summaries = series.Select(s =>
            {
                var sortedObservations = s.Observations?
                    .OrderByDescending(o => o.Date)
                    .ToList() ?? new List<EconomicDataTracker.Entities.Models.FredObservation>();

                var latest = sortedObservations.FirstOrDefault();
                var previous = sortedObservations.Skip(1).FirstOrDefault();

                decimal? changeValue = null;
                decimal? changePercent = null;

                if (latest != null && previous != null && previous.Value != 0)
                {
                    changeValue = latest.Value - previous.Value;
                    changePercent = (changeValue / previous.Value) * 100;
                }

                return new DashboardSummaryViewModel
                {
                    SeriesId = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    LatestValue = latest?.Value,
                    LatestDate = latest?.Date,
                    PreviousValue = previous?.Value,
                    PreviousDate = previous?.Date,
                    ChangeValue = changeValue,
                    ChangePercent = changePercent
                };
            }).OrderBy(s => s.Name);

            return Ok(summaries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard summary");
            return StatusCode(500, "An error occurred while retrieving dashboard summary");
        }
    }

    /// <summary>
    /// Get trend data for specific series over a time period
    /// </summary>
    [HttpGet("trends")]
    public async Task<ActionResult<IEnumerable<SeriesWithObservationsViewModel>>> GetTrends(
        [FromQuery] string? seriesIds = null,
        [FromQuery] string? period = "1year")
    {
        try
        {
            var series = await _unitOfWork.FredSeriesRepository.GetAllAsync();

            // Parse series IDs if provided
            if (!string.IsNullOrEmpty(seriesIds))
            {
                var ids = seriesIds.Split(',')
                    .Select(id => int.TryParse(id.Trim(), out var parsedId) ? parsedId : (int?)null)
                    .Where(id => id.HasValue)
                    .Select(id => id!.Value)
                    .ToList();

                if (ids.Any())
                {
                    series = series.Where(s => ids.Contains(s.Id)).ToList();
                }
            }
            else
            {
                // Default to enabled series if no IDs specified
                series = series.Where(s => s.Enabled).ToList();
            }

            // Calculate date threshold based on period
            var startDate = period?.ToLower() switch
            {
                "1month" => DateTime.Now.AddMonths(-1),
                "3months" => DateTime.Now.AddMonths(-3),
                "6months" => DateTime.Now.AddMonths(-6),
                "1year" => DateTime.Now.AddYears(-1),
                "2years" => DateTime.Now.AddYears(-2),
                "5years" => DateTime.Now.AddYears(-5),
                "10years" => DateTime.Now.AddYears(-10),
                _ => DateTime.Now.AddYears(-1)
            };

            var trends = series.Select(s => new SeriesWithObservationsViewModel
            {
                Series = new SeriesViewModel
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Enabled = s.Enabled,
                    ObservationCount = s.Observations?.Count ?? 0,
                    LastUpdated = s.Observations?.OrderByDescending(o => o.Date).FirstOrDefault()?.Date
                },
                Observations = (s.Observations ?? Enumerable.Empty<EconomicDataTracker.Entities.Models.FredObservation>())
                    .Where(o => o.Date >= startDate)
                    .OrderBy(o => o.Date)
                    .Select(o => new ObservationViewModel
                    {
                        Id = o.Id,
                        Date = o.Date,
                        Value = o.Value,
                        SeriesId = o.FredSeriesId,
                        SeriesName = s.Name,
                        SeriesDescription = s.Description
                    })
                    .ToList()
            }).OrderBy(s => s.Series.Name);

            return Ok(trends);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving trends");
            return StatusCode(500, "An error occurred while retrieving trends");
        }
    }
}
