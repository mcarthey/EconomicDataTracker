namespace EconomicDataTracker.Entities.Models
{
    public class Cpi
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Value { get; set; }  // e.g., CPI index value
    }

    // Additional models like InterestRate, CommodityPrice can follow this structure
}
