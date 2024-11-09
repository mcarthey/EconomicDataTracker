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
            modelBuilder.Entity<Cpi>()
                .Property(c => c.Value)
                .HasPrecision(18, 4); // Adjust precision and scale as needed

            base.OnModelCreating(modelBuilder);
        }
    }
}
