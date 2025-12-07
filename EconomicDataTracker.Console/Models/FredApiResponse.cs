using System.Text.Json.Serialization;

namespace EconomicDataTracker.Console.Models;

public class FredApiResponse
{
    [JsonPropertyName("observations")]
    public List<Observation> Observations { get; set; } = new List<Observation>();
}

public class Observation
{
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;
}
