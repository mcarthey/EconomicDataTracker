using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Entities.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        public DbSet<FredObservation> FredObservations { get; set; }
        public DbSet<FredSeries> FredSeries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
