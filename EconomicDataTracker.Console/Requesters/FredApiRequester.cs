using EconomicDataTracker.Common.Config.Repositories;
using EconomicDataTracker.Common.Requests;
using Microsoft.Extensions.Logging;

namespace EconomicDataTracker.Console.Requesters
{
    public class FredApiRequester : RequestManager
    {
        private readonly ILogger<FredApiRequester> _logger;

        public FredApiRequester(HttpClient httpClient, ConfigRepository configRepository, ILogger<FredApiRequester> logger)
            : base(httpClient, configRepository, logger)
        {
            _logger = logger;
        }

        protected override string GetBaseUrl()
        {
            var baseUrl = ConfigRepository.GetConfiguration("FredBaseUrl");
            var apiKey = ConfigRepository.GetConfiguration("FredApiKey");

            var url = $"{baseUrl}?api_key={apiKey}&file_type=json";
            return url;
        }

        protected override string? GetAuthenticationType()
        {
            // No authentication headers needed
            return null;
        }

        public async Task<string> FetchDataAsync(string seriesName, DateTime lastUpdatedDate)
        {
            return await ExecuteRequestAsync(seriesName, lastUpdatedDate);
        }


    }
}
