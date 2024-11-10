using EconomicDataTracker.Entities.Models;

namespace EconomicDataTracker.Entities.Data
{
    public class FredObservationRepository
    {
        private readonly ApplicationContext _context;

        public FredObservationRepository(ApplicationContext context)
        {
            _context = context;
        }

        public void AddObservationRecord(DateTime date, decimal value)
        {
            var cpiRecord = new FredObservation { Date = date, Value = value };
            _context.FredObservations.Add(cpiRecord);
        }
    }
}
