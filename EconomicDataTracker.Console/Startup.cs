using EconomicDataTracker.Common.Config.Data;
using EconomicDataTracker.Common.Config.Repositories;
using EconomicDataTracker.Common.Entities;
using EconomicDataTracker.Console.Mappers;
using EconomicDataTracker.Console.Requesters;
using EconomicDataTracker.Console.Services;
using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace EconomicDataTracker.Console
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // Register common services
            services.AddCommonServices();

            // Add application-specific contexts
            services.AddApplicationContext();

            // Add configuration context
            services.AddConfigContext();

            // Register application-specific services
            services.AddTransient<FredApiRequester>();
            services.AddTransient<FredObservationRepository>();
            services.AddTransient<FredSeriesRepository>();
            services.AddTransient<FredObservationUpdateTrackerRepository>();
            services.AddTransient<FredObservationMapper>();
            services.AddTransient<MainService>();
            services.AddScoped<UnitOfWork>();
            services.AddSingleton<ConfigRepository>();
        }
    }

}
