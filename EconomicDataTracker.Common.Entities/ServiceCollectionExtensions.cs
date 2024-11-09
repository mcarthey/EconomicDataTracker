using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NReco.Logging.File;
using EconomicDataTracker.Common.Entities.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Common.Entities
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCommonServices(this IServiceCollection services)
        {
            // Use ConfigurationHelper to build configuration
            var configuration = ConfigurationHelper.GetConfiguration();

            // Configure logging
            var fileLoggerOptions = new FileLoggerOptions();
            configuration.GetSection("Logging:File").Bind(fileLoggerOptions);

            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();
                var loggingSection = configuration.GetSection("Logging");

                // Add Console logger
                loggingBuilder.AddConsole();

                // Add File logger with options from configuration
                loggingBuilder.AddFile(loggingSection);
            });

            // Register HttpClient
            services.AddHttpClient();

            return services;
        }

        // Generic method to register any DbContext with configuration
        public static IServiceCollection AddDbContext<TContext>(this IServiceCollection services)
            where TContext : DbContext
        {
            var configuration = ConfigurationHelper.GetConfiguration();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<TContext>(options =>
            {
                ConfigurationHelper.ConfigureDbContextOptions(options, connectionString);
            });

            return services;
        }
    }
}
