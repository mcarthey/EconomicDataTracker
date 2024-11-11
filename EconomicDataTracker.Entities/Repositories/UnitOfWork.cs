using EconomicDataTracker.Entities.Data;

namespace EconomicDataTracker.Entities.Repositories
{
    public class UnitOfWork : IDisposable
    {
        private readonly ApplicationDbContext _dbContext;

        public UnitOfWork(ApplicationDbContext dbContext,
            FredObservationRepository fredObservationRepository,
            FredSeriesRepository fredSeriesRepository,
            FredObservationUpdateTrackerRepository fredObservationUpdateTrackerRepository)
        {
            _dbContext = dbContext;
            FredObservationRepository = fredObservationRepository;
            FredSeriesRepository = fredSeriesRepository;
            FredObservationUpdateTrackerRepository = fredObservationUpdateTrackerRepository;
        }

        public FredObservationRepository FredObservationRepository { get; }
        public FredSeriesRepository FredSeriesRepository { get; }
        public FredObservationUpdateTrackerRepository FredObservationUpdateTrackerRepository { get; }

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
