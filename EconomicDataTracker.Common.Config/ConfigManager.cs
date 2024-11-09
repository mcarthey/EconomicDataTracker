using Microsoft.EntityFrameworkCore;
using EconomicDataTracker.Common.Config.Models;
using EconomicDataTracker.Common.Config.Data;

namespace EconomicDataTracker.Common.Config
{
    public class ConfigManager
    {
        private readonly DbContextOptions<ConfigContext> _dbOptions;

        public ConfigManager(DbContextOptions<ConfigContext> dbOptions)
        {
            _dbOptions = dbOptions;

            using var context = new ConfigContext(_dbOptions);
            context.Database.Migrate();
        }

        public string GetConfiguration(string key)
        {
            using var context = new ConfigContext(_dbOptions);
            var entry = context.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            return entry?.Value;
        }

        public void SetConfiguration(string key, string value)
        {
            using var context = new ConfigContext(_dbOptions);
            var entry = context.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            if (entry == null)
            {
                entry = new ConfigurationEntry { Key = key, Value = value };
                context.ConfigurationEntries.Add(entry);
            }
            else
            {
                entry.Value = value;
            }
            context.SaveChanges();
        }
    }
}
