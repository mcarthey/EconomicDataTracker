using EconomicDataTracker.Entities.Models;
using System.Text.Json;
using EconomicDataTracker.Console.Models;

namespace EconomicDataTracker.Console.Mappers
{
    public class FredObservationMapper
    {
        public IEnumerable<FredObservation> MapFromJson(string jsonData)
        {
            var fredData = JsonSerializer.Deserialize<FredApiResponse>(jsonData);
            if (fredData?.Observations == null)
            {
                return Enumerable.Empty<FredObservation>();
            }

            var observations = new List<FredObservation>();

            foreach (var observation in fredData.Observations)
            {
                if (decimal.TryParse(observation.Value, out var value) && DateTime.TryParse(observation.Date, out var date))
                {
                    observations.Add(new FredObservation
                    {
                        Date = date,
                        Value = value
                    });
                }
            }

            return observations;
        }
    }
}
