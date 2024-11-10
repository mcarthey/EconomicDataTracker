using EconomicDataTracker.Console.Mappers;
using EconomicDataTracker.Console.Requesters;
using EconomicDataTracker.Entities.Data;
using Microsoft.Extensions.Logging;
using EconomicDataTracker.Common.Config;

namespace EconomicDataTracker.Console.Services
{
    public class MainService
    {
        private readonly FredApiRequester _fredApiRequester;
        private readonly UnitOfWork _unitOfWork;
        private readonly FredObservationMapper _mapper;
        private readonly ILogger<MainService> _logger;
        private readonly ConfigManager _configManager;

        public MainService(FredApiRequester fredApiRequester, UnitOfWork unitOfWork, FredObservationMapper mapper, ILogger<MainService> logger, ConfigManager configManager)
        {
            _fredApiRequester = fredApiRequester;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
            _configManager = configManager;
        }

        public async Task RunAsync()
        {
            try
            {
                if (!IsLastObservationDateInThePast())
                {
                    _logger.LogInformation("No new data to process.");
                    return;
                }

                var jsonData = await _fredApiRequester.FetchDataAsync();
                var observations = _mapper.MapFromJson(jsonData);

                foreach (var observation in observations)
                {
                    _unitOfWork.FredObservationRepository.AddObservationRecord(observation.Date, observation.Value);
                }
                await _unitOfWork.SaveChangesAsync();

                _configManager.SetConfiguration("LastObservationDate", DateTime.Now.ToString("yyyy-MM-dd"));
                _logger.LogInformation("Data successfully saved to the database.");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving data to the database.");
            }
        }

        public bool IsLastObservationDateInThePast()
        {
            var lastObservationDateStr = _configManager.GetConfiguration("LastObservationDate");
            if (DateTime.TryParse(lastObservationDateStr, out var lastObservationDate))
            {
                if (lastObservationDate >= DateTime.Now.Date)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
