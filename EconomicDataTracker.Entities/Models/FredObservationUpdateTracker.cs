using System.ComponentModel.DataAnnotations.Schema;

namespace EconomicDataTracker.Entities.Models
{
    public class FredObservationUpdateTracker
    {
        public int Id { get; set; }
        public DateTime LastUpdatedDate { get; set; }

        // navigation property
        public virtual FredSeries FredSeries { get; set; }
        public virtual int FredSeriesId { get; set; }
    }

}
