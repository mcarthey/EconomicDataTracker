using EconomicDataTracker.Common.Config.Models;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Common.Config.Data
{
    public class ConfigDbContext : DbContext
    {
        public ConfigDbContext(DbContextOptions<ConfigDbContext> options) : base(options) { }

        public DbSet<ConfigurationEntry> ConfigurationEntries { get; set; }

    }
}
