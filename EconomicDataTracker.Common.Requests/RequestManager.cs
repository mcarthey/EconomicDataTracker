using EconomicDataTracker.Common.Config;

namespace EconomicDataTracker.Common.Requests
{
    public abstract class RequestManager
    {
        protected readonly HttpClient HttpClient;
        protected readonly ConfigManager ConfigManager;

        protected RequestManager(HttpClient httpClient, ConfigManager configManager)
        {
            HttpClient = httpClient;
            ConfigManager = configManager;
        }

        protected abstract string GetUrl(); // Force subclasses to define their URL

        protected virtual async Task<string> ExecuteRequestAsync()
        {
            var url = GetUrl();
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            ConfigureAuthentication(request);

            var response = await HttpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        private void ConfigureAuthentication(HttpRequestMessage request)
        {
            var authType = GetAuthenticationType();
            if (authType == "ApiKey")
            {
                var apiKey = ConfigManager.GetConfiguration("ApiKey");
                request.Headers.Add("Authorization", $"Bearer {apiKey}");
            }
            else if (authType == "Basic")
            {
                var username = ConfigManager.GetConfiguration("Username");
                var password = ConfigManager.GetConfiguration("Password");
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
