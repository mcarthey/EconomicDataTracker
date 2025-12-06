using System.ComponentModel.DataAnnotations.Schema;

namespace EconomicDataTracker.Entities.Models
{
    public class FredObservation
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Value { get; set; }

        // navigation property
        public virtual FredSeries? FredSeries { get; set; }
        public virtual int FredSeriesId { get; set; }
    }

}
