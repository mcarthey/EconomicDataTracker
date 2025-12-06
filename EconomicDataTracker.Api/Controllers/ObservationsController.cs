using EconomicDataTracker.Api.ViewModels;
using EconomicDataTracker.Entities.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EconomicDataTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ObservationsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ObservationsController> _logger;

    public ObservationsController(IUnitOfWork unitOfWork, ILogger<ObservationsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get observations with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ObservationViewModel>>> GetFiltered(
        [FromQuery] string? seriesIds = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int? limit = null,
        [FromQuery] string sortBy = "date",
        [FromQuery] string sortOrder = "asc")
    {
        try
        {
            var observations = await _unitOfWork.FredObservationRepository.GetAllAsync();

            // Parse series IDs if provided (comma-separated)
            if (!string.IsNullOrEmpty(seriesIds))
            {
                var ids = seriesIds.Split(',')
                    .Select(id => int.TryParse(id.Trim(), out var parsedId) ? parsedId : (int?)null)
                    .Where(id => id.HasValue)
                    .Select(id => id!.Value)
                    .ToList();

                if (ids.Any())
                {
                    observations = observations.Where(o => ids.Contains(o.FredSeriesId)).ToList();
                }
            }

            // Apply date filters
            if (startDate.HasValue)
            {
                observations = observations.Where(o => o.Date >= startDate.Value).ToList();
            }

            if (endDate.HasValue)
            {
                observations = observations.Where(o => o.Date <= endDate.Value).ToList();
            }

            // Convert to view models
            var viewModels = observations.Select(o => new ObservationViewModel
            {
                Id = o.Id,
                Date = o.Date,
                Value = o.Value,
                SeriesId = o.FredSeriesId,
                SeriesName = o.FredSeries?.Name ?? string.Empty,
                SeriesDescription = o.FredSeries?.Description ?? string.Empty
            }).AsQueryable();

            // Apply sorting
            viewModels = sortBy.ToLower() switch
            {
                "value" => sortOrder.ToLower() == "desc"
                    ? viewModels.OrderByDescending(o => o.Value)
                    : viewModels.OrderBy(o => o.Value),
                "series" => sortOrder.ToLower() == "desc"
                    ? viewModels.OrderByDescending(o => o.SeriesName)
                    : viewModels.OrderBy(o => o.SeriesName),
                _ => sortOrder.ToLower() == "desc"
                    ? viewModels.OrderByDescending(o => o.Date)
                    : viewModels.OrderBy(o => o.Date)
            };

            // Apply limit
            if (limit.HasValue && limit.Value > 0)
            {
                viewModels = viewModels.Take(limit.Value).AsQueryable();
            }

            return Ok(viewModels.ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving filtered observations");
            return StatusCode(500, "An error occurred while retrieving observations");
        }
    }

    /// <summary>
    /// Get latest observation for each series
    /// </summary>
    [HttpGet("latest")]
    public async Task<ActionResult<IEnumerable<ObservationViewModel>>> GetLatest([FromQuery] string? seriesIds = null)
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

            var latestObservations = series
                .Select(s => s.Observations?.OrderByDescending(o => o.Date).FirstOrDefault())
                .Where(o => o != null)
                .Select(o => new ObservationViewModel
                {
                    Id = o!.Id,
                    Date = o.Date,
                    Value = o.Value,
                    SeriesId = o.FredSeriesId,
                    SeriesName = o.FredSeries?.Name ?? string.Empty,
                    SeriesDescription = o.FredSeries?.Description ?? string.Empty
                })
                .OrderBy(o => o.SeriesName);

            return Ok(latestObservations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving latest observations");
            return StatusCode(500, "An error occurred while retrieving latest observations");
        }
    }
}
