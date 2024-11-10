using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EconomicDataTracker.Common.Entities.Helpers
{
    public static class ConfigurationHelper
    {
        public static IConfigurationRoot GetConfiguration(string? basePath = null, string environmentName = "Dev")
        {
            // Set basePath to look for "Configs" directly in the current working directory
            basePath ??= Path.Combine(Directory.GetCurrentDirectory(), "Configs");

            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();

            return builder.Build();
        }




        public static void ConfigureDbContextOptions(DbContextOptionsBuilder optionsBuilder, string connectionString)
        {
            optionsBuilder.UseSqlServer(connectionString, options =>
                {
                    // Specify the migrations assembly to centralize migrations in EconomicDataTracker.Migrations
                    options.MigrationsAssembly("EconomicDataTracker.Migrations");
                })
                .UseLazyLoadingProxies();
        }
    }
}
