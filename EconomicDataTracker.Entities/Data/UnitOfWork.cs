namespace EconomicDataTracker.Entities.Data
{
    public class UnitOfWork : IDisposable
    {
        private readonly ApplicationContext _context;

        public UnitOfWork(ApplicationContext context, FredObservationRepository fredObservationRepository)
        {
            _context = context;
            FredObservationRepository = fredObservationRepository;
        }

        public FredObservationRepository FredObservationRepository { get; }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
