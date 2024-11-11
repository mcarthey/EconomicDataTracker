using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace EconomicDataTracker.Entities.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<FredObservation> FredObservations { get; set; }
        public DbSet<FredSeries> FredSeries { get; set; }
        public DbSet<FredObservationUpdateTracker> FredObservationUpdateTrackers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
