using EconomicDataTracker.Console.Mappers;
using EconomicDataTracker.Console.Requesters;
using Microsoft.Extensions.Logging;
using EconomicDataTracker.Entities.Repositories;
using EconomicDataTracker.Common.Config.Repositories;
using EconomicDataTracker.Entities.Models;

namespace EconomicDataTracker.Console.Services
{
    public class MainService
    {
        private readonly FredApiRequester _fredApiRequester;
        private readonly UnitOfWork _unitOfWork;
        private readonly FredObservationMapper _mapper;
        private readonly ILogger<MainService> _logger;
        private readonly ConfigRepository _configRepository;

        public MainService(FredApiRequester fredApiRequester, UnitOfWork unitOfWork, FredObservationMapper mapper, ILogger<MainService> logger, ConfigRepository configRepository)
        {
            _fredApiRequester = fredApiRequester;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
            _configRepository = configRepository;
        }

        public async Task RunAsync()
        {
            try
            {
                var allEnabledSeries = await GetAllEnabledSeriesAsync();

                foreach (var series in allEnabledSeries)
                {
                    var seriesId = series.Id;
                    var seriesName = series.Name;

                    var lastUpdatedDate = GetLastTrackedUpdatedDate(seriesId);

                    if (!IsLastUpdatedDateInThePast(lastUpdatedDate))
                    {
                        _logger.LogInformation($"No new data to process for series {seriesName}.");
                        continue;
                    }

                    var jsonData = await _fredApiRequester.FetchDataAsync(seriesName, lastUpdatedDate);
                    var observations = _mapper.MapFromJson(jsonData);

                    foreach (var observation in observations)
                    {
                        _unitOfWork.FredObservationRepository.AddObservationRecord(observation.Date, observation.Value, seriesId);
                    }

                    await _unitOfWork.FredObservationUpdateTrackerRepository.AddOrUpdateAsync(seriesId, DateTime.Now);
                    await _unitOfWork.SaveChangesAsync();

                    _logger.LogInformation($"Data successfully saved to the database for series {seriesName}.");

                }
                _logger.LogInformation("All observations processed and saved to the database.");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving data to the database.");
            }
        }

        public async Task<IEnumerable<FredSeries>> GetAllEnabledSeriesAsync()
        {
            return await _unitOfWork.FredSeriesRepository.FindAsync(x => x.Enabled == true);
        }

        public DateTime GetLastTrackedUpdatedDate(int seriesId)
        {
            return _unitOfWork.FredObservationUpdateTrackerRepository.GetLastUpdatedDateBySeries(seriesId);
        }

        public bool IsLastUpdatedDateInThePast(DateTime lastUpdatedDate)
        {
            if (lastUpdatedDate >= DateTime.Now.Date)
            {
                return false;
            }
            return true;
        }
    }
}
