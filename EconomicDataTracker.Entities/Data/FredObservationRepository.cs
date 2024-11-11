using EconomicDataTracker.Entities.Models;

namespace EconomicDataTracker.Entities.Data
{
    public class FredObservationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public FredObservationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddObservationRecord(DateTime date, decimal value)
        {
            var cpiRecord = new FredObservation { Date = date, Value = value };
            _dbContext.FredObservations.Add(cpiRecord);
        }
    }
}
