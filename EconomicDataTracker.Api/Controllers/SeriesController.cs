using EconomicDataTracker.Api.ViewModels;
using EconomicDataTracker.Entities.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeriesController : ControllerBase
{
    private readonly UnitOfWork _unitOfWork;
    private readonly ILogger<SeriesController> _logger;

    public SeriesController(UnitOfWork unitOfWork, ILogger<SeriesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all economic series
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeriesViewModel>>> GetAll([FromQuery] bool? enabledOnly = null)
    {
        try
        {
            var series = await _unitOfWork.FredSeriesRepository.GetAllAsync();

            if (enabledOnly == true)
            {
                series = series.Where(s => s.Enabled).ToList();
            }

            var viewModels = series.Select(s => new SeriesViewModel
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Enabled = s.Enabled,
                ObservationCount = s.Observations?.Count ?? 0,
                LastUpdated = s.Observations?.OrderByDescending(o => o.Date).FirstOrDefault()?.Date
            }).OrderBy(s => s.Name);

            return Ok(viewModels);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all series");
            return StatusCode(500, "An error occurred while retrieving series");
        }
    }

    /// <summary>
    /// Get a specific series by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SeriesViewModel>> GetById(int id)
    {
        try
        {
            var series = await _unitOfWork.FredSeriesRepository.GetByIdAsync(id);

            if (series == null)
            {
                return NotFound($"Series with ID {id} not found");
            }

            var viewModel = new SeriesViewModel
            {
                Id = series.Id,
                Name = series.Name,
                Description = series.Description,
                Enabled = series.Enabled,
                ObservationCount = series.Observations?.Count ?? 0,
                LastUpdated = series.Observations?.OrderByDescending(o => o.Date).FirstOrDefault()?.Date
            };

            return Ok(viewModel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving series {SeriesId}", id);
            return StatusCode(500, "An error occurred while retrieving the series");
        }
    }

    /// <summary>
    /// Get a series with all its observations
    /// </summary>
    [HttpGet("{id}/observations")]
    public async Task<ActionResult<SeriesWithObservationsViewModel>> GetWithObservations(
        int id,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var series = await _unitOfWork.FredSeriesRepository.GetByIdAsync(id);

            if (series == null)
            {
                return NotFound($"Series with ID {id} not found");
            }

            var observations = series.Observations?.AsQueryable() ?? Enumerable.Empty<EconomicDataTracker.Entities.Models.FredObservation>().AsQueryable();

            if (startDate.HasValue)
            {
                observations = observations.Where(o => o.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                observations = observations.Where(o => o.Date <= endDate.Value);
            }

            var viewModel = new SeriesWithObservationsViewModel
            {
                Series = new SeriesViewModel
                {
                    Id = series.Id,
                    Name = series.Name,
                    Description = series.Description,
                    Enabled = series.Enabled,
                    ObservationCount = series.Observations?.Count ?? 0,
                    LastUpdated = series.Observations?.OrderByDescending(o => o.Date).FirstOrDefault()?.Date
                },
                Observations = observations.OrderBy(o => o.Date).Select(o => new ObservationViewModel
                {
                    Id = o.Id,
                    Date = o.Date,
                    Value = o.Value,
                    SeriesId = o.FredSeriesId,
                    SeriesName = series.Name,
                    SeriesDescription = series.Description
                }).ToList()
            };

            return Ok(viewModel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving series {SeriesId} with observations", id);
            return StatusCode(500, "An error occurred while retrieving the series with observations");
        }
    }
}
