using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Entities.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        public DbSet<Cpi> Cpis { get; set; }

        // Add DbSets for other models like InterestRate, CommodityPrice

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure model properties, relationships, etc. here if needed
        }
    }
}
