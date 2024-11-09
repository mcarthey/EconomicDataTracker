using System.Text.Json;
using EconomicDataTracker.Console.Models;
using EconomicDataTracker.Console.Requesters;
using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;
using Microsoft.Extensions.Logging;

namespace EconomicDataTracker.Console.Services
{
    public class MainService
    {
        private readonly FredApiRequester _fredApiRequester;
        private readonly ApplicationContext _context;
        private readonly ILogger<MainService> _logger;

        public MainService(FredApiRequester fredApiRequester, ApplicationContext context, ILogger<MainService> logger)
        {
            _fredApiRequester = fredApiRequester;
            _context = context;
            _logger = logger;
        }

        public async Task RunAsync()
        {
            try
            {
                var jsonData = await _fredApiRequester.FetchDataAsync();
                var fredData = JsonSerializer.Deserialize<FredApiResponse>(jsonData);

                foreach (var observation in fredData.Observations)
                {
                    if (decimal.TryParse(observation.Value, out var value) && DateTime.TryParse(observation.Date, out var date))
                    {
                        var cpiRecord = new Cpi
                        {
                            Date = date,
                            Value = value
                        };
                        _context.Cpis.Add(cpiRecord);
                    }
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation("Data successfully saved to the database.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving data to the database.");
            }
        }
    }
}
