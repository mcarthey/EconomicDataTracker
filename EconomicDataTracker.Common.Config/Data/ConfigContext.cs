using EconomicDataTracker.Common.Config.Models;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Common.Config.Data
{
    public class ConfigContext : DbContext
    {
        public ConfigContext(DbContextOptions<ConfigContext> options) : base(options) { }

        public DbSet<ConfigurationEntry> ConfigurationEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ConfigurationEntry>()
                .HasIndex(e => e.Key)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
