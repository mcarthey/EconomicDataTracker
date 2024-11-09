using System.Text.Json.Serialization;

namespace EconomicDataTracker.Console.Models;

public class FredApiResponse
{
    [JsonPropertyName("observations")]
    public List<Observation> Observations { get; set; }
}

public class Observation
{
    [JsonPropertyName("date")]
    public string Date { get; set; }

    [JsonPropertyName("value")]
    public string Value { get; set; }
}
