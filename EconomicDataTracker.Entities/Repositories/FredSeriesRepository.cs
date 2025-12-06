using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EconomicDataTracker.Entities.Repositories
{
    public class FredSeriesRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public FredSeriesRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create
        public async Task AddAsync(FredSeries series)
        {
            await _dbContext.FredSeries.AddAsync(series);
        }

        // Read
        public async Task<FredSeries?> GetByIdAsync(int id)
        {
            return await _dbContext.FredSeries
                .Include(s => s.Observations)
                .SingleOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<FredSeries>> GetAllAsync()
        {
            return await _dbContext.FredSeries
                .Include(s => s.Observations)
                .ToListAsync();
        }

        // Update
        public void Update(FredSeries series)
        {
            _dbContext.FredSeries.Update(series);
        }

        // Delete
        public async Task DeleteAsync(int id)
        {
            var series = await GetByIdAsync(id);
            if (series != null)
            {
                _dbContext.FredSeries.Remove(series);
            }
        }

        // Find
        public async Task<IEnumerable<FredSeries>> FindAsync(Expression<Func<FredSeries, bool>> predicate)
        {
            return await _dbContext.FredSeries
                .Include(s => s.Observations)
                .Where(predicate)
                .ToListAsync();
        }
    }
}
