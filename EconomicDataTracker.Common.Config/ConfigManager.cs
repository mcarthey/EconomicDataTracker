namespace EconomicDataTracker.Common.Config
{
    public class ConfigManager
    {
        private readonly Dictionary<string, string> _configurations;

        public ConfigManager()
        {
            _configurations = LoadConfigurationsFromDatabase();
        }

        public string GetConfiguration(string key)
        {
            return _configurations.ContainsKey(key) ? _configurations[key] : null;
        }

        private Dictionary<string, string> LoadConfigurationsFromDatabase()
        {
            // Replace with actual DB code to fetch configurations
            return new Dictionary<string, string>
            {
                { "FredApiKey", "ADD API KEY" },
                { "FredBaseUrl", "https://api.stlouisfed.org/fred/series/observations" },
                { "ObservationStart", "1980-01-01" }
            };
        }
    }
}
