using EconomicDataTracker.Common.Config;
using EconomicDataTracker.Common.Logging;
using EconomicDataTracker.Common.Requests;
using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;
using EconomicDataTracker.FredApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace EconomicDataTracker.FredApi.Services
{
    public class MainService
    {
        private readonly FredRequestManager _fredRequestManager;
        private readonly ApplicationContext _context;
        private readonly ILogger<MainService> _logger;

        public MainService(FredRequestManager fredRequestManager, ApplicationContext context, ILogger<MainService> logger)
        {
            _fredRequestManager = fredRequestManager;
            _context = context;
            _logger = logger;
        }

        public async Task RunAsync()
        {
            try
            {
                var jsonData = await _fredRequestManager.FetchDataAsync();
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
