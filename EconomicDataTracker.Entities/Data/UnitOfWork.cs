namespace EconomicDataTracker.Entities.Data
{
    public class UnitOfWork : IDisposable
    {
        private readonly ApplicationDbContext _dbContext;

        public UnitOfWork(ApplicationDbContext dbContext, FredObservationRepository fredObservationRepository)
        {
            _dbContext = dbContext;
            FredObservationRepository = fredObservationRepository;
        }

        public FredObservationRepository FredObservationRepository { get; }

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
