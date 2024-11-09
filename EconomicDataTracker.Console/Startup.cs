﻿using EconomicDataTracker.Common.Config;
using EconomicDataTracker.Common.Config.Data;
using EconomicDataTracker.Common.Entities;
using EconomicDataTracker.Console.Requesters;
using EconomicDataTracker.Console.Services;
using EconomicDataTracker.Entities.Data;
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
            services.AddTransient<CpiService>();
            services.AddTransient<MainService>();
            services.AddSingleton<ConfigManager>();
        }
    }

}
