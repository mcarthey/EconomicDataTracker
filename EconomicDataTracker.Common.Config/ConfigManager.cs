using EconomicDataTracker.Common.Config.Models;
using EconomicDataTracker.Common.Config.Data;

namespace EconomicDataTracker.Common.Config
{
    public class ConfigManager
    {
        private readonly ConfigContext _context;

        public ConfigManager(ConfigContext context)
        {
            _context = context;
        }

        public string GetConfiguration(string key)
        {
            var entry = _context.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            return entry?.Value;
        }

        public void SetConfiguration(string key, string value)
        {
            var entry = _context.ConfigurationEntries.SingleOrDefault(e => e.Key == key);
            if (entry == null)
            {
                entry = new ConfigurationEntry { Key = key, Value = value };
                _context.ConfigurationEntries.Add(entry);
            }
            else
            {
                entry.Value = value;
            }
            _context.SaveChanges();
        }
    }
}
