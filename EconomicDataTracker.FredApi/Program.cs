﻿using EconomicDataTracker.FredApi.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EconomicDataTracker.FredApi
{
    public static class Program
    {
        private static async Task Main(string[] args)
        {
            var serviceCollection = new ServiceCollection();
            Startup.ConfigureServices(serviceCollection);

            var serviceProvider = serviceCollection.BuildServiceProvider();

            var mainService = serviceProvider.GetService<MainService>();
            await mainService?.RunAsync();
        }
    }
}
