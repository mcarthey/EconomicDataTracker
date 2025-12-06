using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EconomicDataTracker.Entities.Repositories
{
    public class FredObservationUpdateTrackerRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public FredObservationUpdateTrackerRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create
        public async Task AddAsync(FredObservationUpdateTracker updateTracker)
        {
            await _dbContext.FredObservationUpdateTrackers.AddAsync(updateTracker);
        }

        // Read
        public async Task<FredObservationUpdateTracker?> GetByIdAsync(int id)
        {
            return await _dbContext.FredObservationUpdateTrackers
                .Include(ut => ut.FredSeries)
                .SingleOrDefaultAsync(ut => ut.Id == id);
        }

        public async Task<IEnumerable<FredObservationUpdateTracker>> GetAllAsync()
        {
            return await _dbContext.FredObservationUpdateTrackers
                .Include(ut => ut.FredSeries)
                .ToListAsync();
        }

        // Update
        public void Update(FredObservationUpdateTracker updateTracker)
        {
            _dbContext.FredObservationUpdateTrackers.Update(updateTracker);
        }

        // Delete
        public async Task DeleteAsync(int id)
        {
            var updateTracker = await GetByIdAsync(id);
            if (updateTracker != null)
            {
                _dbContext.FredObservationUpdateTrackers.Remove(updateTracker);
            }
        }

        // Find
        public async Task<IEnumerable<FredObservationUpdateTracker>> FindAsync(Expression<Func<FredObservationUpdateTracker, bool>> predicate)
        {
            return await _dbContext.FredObservationUpdateTrackers
                .Include(ut => ut.FredSeries)
                .Where(predicate)
                .ToListAsync();
        }

        public DateTime GetLastUpdatedDateBySeries(int seriesId)
        {
            // provide the fred series id and return the last updated date value
            return _dbContext.FredObservationUpdateTrackers
                .Where(ut => ut.FredSeriesId == seriesId)
                .Select(ut => ut.LastUpdatedDate)
                .AsEnumerable() // Switch to client-side evaluation
                .DefaultIfEmpty(new DateTime(2000, 1, 1))
                .First();
        }

        // Add or Update
        public async Task AddOrUpdateAsync(int fredSeriesId, DateTime lastUpdatedDate)
        {
            var existingTracker = await _dbContext.FredObservationUpdateTrackers
                .SingleOrDefaultAsync(ut => ut.FredSeriesId == fredSeriesId);

            if (existingTracker != null)
            {
                existingTracker.LastUpdatedDate = lastUpdatedDate;
                _dbContext.FredObservationUpdateTrackers.Update(existingTracker);
            }
            else
            {
                var newTracker = new FredObservationUpdateTracker
                {
                    FredSeriesId = fredSeriesId,
                    LastUpdatedDate = lastUpdatedDate
                };
                await _dbContext.FredObservationUpdateTrackers.AddAsync(newTracker);
            }
        }
    }
}
