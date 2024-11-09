using EconomicDataTracker.Console.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EconomicDataTracker.Console
{
    public static class Program
    {
        private static async Task Main(string[] args)
        {
            var serviceCollection = new ServiceCollection();
            var startup = new Startup();
            startup.ConfigureServices(serviceCollection);

            var serviceProvider = serviceCollection.BuildServiceProvider();

            var mainService = serviceProvider.GetService<MainService>();
            await mainService?.RunAsync();
        }
    }
}
