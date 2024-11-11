using EconomicDataTracker.Common.Config.Repositories;
using Microsoft.Extensions.Logging;

namespace EconomicDataTracker.Common.Requests
{
    public abstract class RequestManager
    {
        protected readonly HttpClient HttpClient;
        protected readonly ConfigRepository ConfigRepository;
        private readonly ILogger<RequestManager> _logger;

        protected RequestManager(HttpClient httpClient, ConfigRepository configRepository, ILogger<RequestManager> logger)
        {
            HttpClient = httpClient;
            ConfigRepository = configRepository;
            _logger = logger;
        }

        protected abstract string GetBaseUrl(); // Force subclasses to define their URL

        protected virtual async Task<string> ExecuteRequestAsync(string seriesName, DateTime lastUpdatedDate)
        {
            var lastUpdatedDateStr = lastUpdatedDate.ToString("yyyy-MM-dd");
            var urlBase = GetBaseUrl();
            var url = $"{urlBase}&series_id={seriesName}&observation_start={lastUpdatedDateStr}";
            var request = new HttpRequestMessage(HttpMethod.Get, url);

            ConfigureAuthentication(request);

            var response = await HttpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                // Log the status code and reason
                _logger.LogError("Request to {Url} failed with status code: {StatusCode} ({ReasonPhrase})",
                    url, (int)response.StatusCode, response.ReasonPhrase);

                // Log response headers
                _logger.LogError("Response Headers:");
                foreach (var header in response.Headers)
                {
                    _logger.LogError("{Header}: {Value}", header.Key, string.Join(", ", header.Value));
                }

                // Log response body, if any
                var responseBody = await response.Content.ReadAsStringAsync();
                if (!string.IsNullOrEmpty(responseBody))
                {
                    _logger.LogError("Response Body: {ResponseBody}", responseBody);
                }

                // Throw exception after logging
                throw new HttpRequestException($"Request to {url} failed with status code {(int)response.StatusCode}: {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsStringAsync();
        }

        private void ConfigureAuthentication(HttpRequestMessage request)
        {
            var authType = GetAuthenticationType();
            if (authType == "ApiKey")
            {
                var apiKey = ConfigRepository.GetConfiguration("ApiKey");
                request.Headers.Add("Authorization", $"Bearer {apiKey}");
            }
            else if (authType == "Basic")
            {
                var username = ConfigRepository.GetConfiguration("Username");
                var password = ConfigRepository.GetConfiguration("Password");
                var byteArray = System.Text.Encoding.ASCII.GetBytes($"{username}:{password}");
                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Basic",
                    System.Convert.ToBase64String(byteArray));
            }
            // Add other auth types as needed
        }

        protected abstract string GetAuthenticationType(); // Define in subclasses if required
    }
}
