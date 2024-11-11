using EconomicDataTracker.Common.Config.Models;
using EconomicDataTracker.Common.Config.Data;

namespace EconomicDataTracker.Common.Config.Repositories
{
    public class ConfigRepository
    {
        private readonly ConfigDbContext _dbContext;

        public ConfigRepository(ConfigDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public string GetConfiguration(string key)
        {
            var entry = _dbContext.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            return entry?.Value;
        }

        public void SetConfiguration(string key, string value)
        {
            var entry = _dbContext.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            if (entry == null)
            {
                entry = new ConfigurationEntry { Key = key, Value = value };
                _dbContext.ConfigurationEntries.Add(entry);
            }
            else
            {
                entry.Value = value;
            }
            _dbContext.SaveChanges();
        }
    }
}
