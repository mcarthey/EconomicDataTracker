using EconomicDataTracker.Common.Config;
using EconomicDataTracker.Common.Requests;

namespace EconomicDataTracker.Console.Requesters
{
    public class FredApiRequester : RequestManager
    {
        public FredApiRequester(HttpClient httpClient, ConfigManager configManager)
            : base(httpClient, configManager)
        {
        }

        protected override string GetUrl()
        {
            var baseUrl = ConfigManager.GetConfiguration("FredBaseUrl");
            var apiKey = ConfigManager.GetConfiguration("FredApiKey");
            var seriesId = "CPIAUCSL"; // Consumer Price Index

            // TODO will need to pass in the value to avoid adding a dependency on the DbContext
            //var lastRecord = _dbContext.CPIs.OrderByDescending(c => c.Date).FirstOrDefault();
            //var observationStart = lastRecord != null ? lastRecord.Date.AddDays(1).ToString("yyyy-MM-dd") : "1980-01-01";

            var observationStart = ConfigManager.GetConfiguration("ObservationStart"); // e.g., "1980-01-01"

            var url = $"{baseUrl}?series_id={seriesId}&api_key={apiKey}&file_type=json&observation_start={observationStart}";
            return url;
        }

        protected override string GetAuthenticationType()
        {
            // No authentication headers needed
            return null;
        }

        public async Task<string> FetchDataAsync()
        {
            return await ExecuteRequestAsync();
        }
    }
}
