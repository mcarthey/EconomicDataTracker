using EconomicDataTracker.Entities.Helpers;
using Microsoft.Extensions.DependencyInjection;
using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.FredApi.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NReco.Logging.File;
using EconomicDataTracker.Common.Config;
using EconomicDataTracker.Common.Requests;

namespace EconomicDataTracker.FredApi
{
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // Build configuration
            var configuration = ConfigurationHelper.GetConfiguration();

            // Create and bind FileLoggerOptions
            var fileLoggerOptions = new NReco.Logging.File.FileLoggerOptions();
            configuration.GetSection("Logging:File").Bind(fileLoggerOptions);

            // Configure logging
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();
                var loggingSection = configuration.GetSection("Logging");

                // Add Console logger
                loggingBuilder.AddConsole();

                loggingBuilder.AddFile(loggingSection);

                // Add File logger with options bound from configuration
                //loggingBuilder.AddProvider(new NReco.Logging.File.FileLoggerProvider(fileLoggerOptions.));
            });

            // Register DbContext with dependency injection
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationContext>(options =>
            {
                ConfigurationHelper.ConfigureDbContextOptions(options, connectionString);
            });


            // Register your services
            services.AddSingleton<ConfigManager>();
            services.AddHttpClient(); // Registers HttpClient in DI

            // Register the specific RequestManager for this app
            services.AddTransient<FredRequestManager>();
            services.AddTransient<CpiService>();
            services.AddTransient<MainService>();
        }
    }

}
