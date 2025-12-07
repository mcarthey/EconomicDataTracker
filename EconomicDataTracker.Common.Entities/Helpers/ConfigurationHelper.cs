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
            // Detect if using SQLite based on connection string pattern
            if (connectionString.Contains("Data Source=") && !connectionString.Contains("Server="))
            {
                // Configure for SQLite
                optionsBuilder.UseSqlite(connectionString, options =>
                    {
                        // Specify the migrations assembly to centralize migrations in EconomicDataTracker.Migrations
                        options.MigrationsAssembly("EconomicDataTracker.Migrations");
                    })
                    .UseLazyLoadingProxies();
            }
            else
            {
                // Configure for SQL Server
                optionsBuilder.UseSqlServer(connectionString, options =>
                    {
                        // Specify the migrations assembly to centralize migrations in EconomicDataTracker.Migrations
                        options.MigrationsAssembly("EconomicDataTracker.Migrations");
                    })
                    .UseLazyLoadingProxies();
            }
        }
    }
}
