namespace EconomicDataTracker.Entities.Models
{
    public class FredSeries
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Boolean Enabled { get; set; }


        // navigation property
        public virtual ICollection<FredObservation> Observations { get; set; } = new List<FredObservation>();
    }
}
