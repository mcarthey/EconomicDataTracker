using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Models;

namespace EconomicDataTracker.Console.Services
{
    public class CpiService
    {
        private readonly ApplicationContext _context;

        public CpiService(ApplicationContext context)
        {
            _context = context;
        }

        public void AddCpiRecord(DateTime date, decimal value)
        {
            var cpiRecord = new Cpi { Date = date, Value = value };
            _context.Cpis.Add(cpiRecord);
            _context.SaveChanges();
        }
    }
}
