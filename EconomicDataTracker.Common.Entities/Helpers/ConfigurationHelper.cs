using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EconomicDataTracker.Common.Entities.Helpers
{
    public static class ConfigurationHelper
    {
        public static IConfigurationRoot GetConfiguration(string? basePath = null, string environmentName = null)
        {
            // Set the base path to the shared configuration folder
            basePath ??= Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "SharedConfig");

            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            // Optionally add environment-specific configuration
            if (!string.IsNullOrEmpty(environmentName))
            {
                builder.AddJsonFile($"appsettings.{environmentName}.json", optional: true);
            }

            builder.AddEnvironmentVariables();

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
