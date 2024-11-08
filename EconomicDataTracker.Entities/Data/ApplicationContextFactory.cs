using EconomicDataTracker.Entities.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace EconomicDataTracker.Entities.Data
{
    public class GameContextFactory : IDesignTimeDbContextFactory<ApplicationContext>
    {
        public ApplicationContext CreateDbContext(string[] args)
        {
            // Build configuration
            var configuration = ConfigurationHelper.GetConfiguration();

            // Get connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Build options
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationContext>();
            ConfigurationHelper.ConfigureDbContextOptions(optionsBuilder, connectionString);

            // Create and return the context
            return new ApplicationContext(optionsBuilder.Options);
        }
    }
}
