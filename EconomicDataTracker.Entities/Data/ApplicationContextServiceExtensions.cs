using EconomicDataTracker.Common.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace EconomicDataTracker.Entities.Data
{
    public static class ApplicationContextServiceExtensions
    {
        public static IServiceCollection AddApplicationContext(this IServiceCollection services)
        {
            // Use the generic AddDbContext method from Common.Entities to register ApplicationContext
            return services.AddDbContext<ApplicationDbContext>();
        }
    }
}
