using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EconomicDataTracker.Entities.Repositories
{
    public class FredObservationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public FredObservationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create
        public async Task AddAsync(FredObservation observation)
        {
            await _dbContext.FredObservations.AddAsync(observation);
        }

        // Read
        public async Task<FredObservation> GetByIdAsync(int id)
        {
            return await _dbContext.FredObservations
                .Include(o => o.FredSeries)
                .SingleOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<FredObservation>> GetAllAsync()
        {
            return await _dbContext.FredObservations
                .Include(o => o.FredSeries)
                .ToListAsync();
        }

        // Update
        public void Update(FredObservation observation)
        {
            _dbContext.FredObservations.Update(observation);
        }

        // Delete
        public async Task DeleteAsync(int id)
        {
            var observation = await GetByIdAsync(id);
            if (observation != null)
            {
                _dbContext.FredObservations.Remove(observation);
            }
        }

        // Find
        public async Task<IEnumerable<FredObservation>> FindAsync(Expression<Func<FredObservation, bool>> predicate)
        {
            return await _dbContext.FredObservations
                .Include(o => o.FredSeries)
                .Where(predicate)
                .ToListAsync();
        }

        // AddObservationRecord
        public void AddObservationRecord(DateTime date, decimal value, int fredSeriesId)
        {
            var observation = new FredObservation { Date = date, Value = value, FredSeriesId = fredSeriesId };
            _dbContext.FredObservations.Add(observation);
        }
    }
}
