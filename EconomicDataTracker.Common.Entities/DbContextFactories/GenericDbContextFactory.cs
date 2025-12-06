using EconomicDataTracker.Common.Entities.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace EconomicDataTracker.Common.Entities.DbContextFactories
{
    public class GenericDbContextFactory<TContext> : IDesignTimeDbContextFactory<TContext> where TContext : DbContext
    {
        public TContext CreateDbContext(string[] args)
        {
            // Load configuration
            var configuration = ConfigurationHelper.GetConfiguration();

            // Get connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

            // Configure DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<TContext>();
            ConfigurationHelper.ConfigureDbContextOptions(optionsBuilder, connectionString);

            // Create and return the DbContext instance
            return (TContext?)Activator.CreateInstance(typeof(TContext), optionsBuilder.Options)
                ?? throw new InvalidOperationException($"Could not create instance of {typeof(TContext).Name}");
        }
    }
}
