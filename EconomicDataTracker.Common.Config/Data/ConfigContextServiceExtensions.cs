using EconomicDataTracker.Common.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace EconomicDataTracker.Common.Config.Data
{
    public static class ConfigContextServiceExtensions
    {
        public static IServiceCollection AddConfigContext(this IServiceCollection services)
        {
            // Use the generic AddDbContext method from Common.Entities to register ApplicationContext
            return services.AddDbContext<ConfigContext>();
        }
    }
}
