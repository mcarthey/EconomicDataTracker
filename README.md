# Economic Data Tracker

This project is a C# application designed to collect, store, and track economic data, specifically using the FRED (Federal Reserve Economic Data) API. Initially set up to pull the Consumer Price Index (CPI) data from 1980 onwards, this application can be configured to pull and store recent data on a scheduled basis. The application is modular, with support for additional economic indicators in the future.

## Features

- **Data Collection**: Pulls economic data from the FRED API, specifically targeting the CPI for All Urban Consumers.
- **Historical and Incremental Updates**: Initially populates the database with historical data, and subsequent runs pull only recent data.
- **Logging**: Configurable logging to both console and file, set up with NReco.Logging.File.
- **Database Storage**: Data is stored in a relational database using Entity Framework Core.
- **Dependency Injection**: Utilizes dependency injection for modularity and testability.

## Project Structure

- **Common Libraries**: Shared libraries for logging, request management, and configuration.
- **Data Models**: EF Core data models are defined in the `Entities` project to manage economic data storage.
- **Console Applications**: Each API has its own console application (e.g., FRED API), making it easy to expand to other data sources.

## Getting Started

### Prerequisites

- **.NET SDK**: [.NET 6 or later](https://dotnet.microsoft.com/download/dotnet).
- **Database**: A relational database (SQL Server, PostgreSQL, etc.) with connection details specified in `appsettings.json`.
- **FRED API Key**: Sign up at [FRED](https://fred.stlouisfed.org/docs/api/api_key.html) to obtain an API key.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/economic-data-tracker.git
   cd economic-data-tracker
   ```

2. **Set Up Configuration**:
   Update `appsettings.json` with your database connection string and FRED API key.

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Your_Database_Connection_String"
     },
     "Logging": {
       "File": {
         "Path": "Logs/log.txt",
         "FileSizeLimitBytes": 10485760,
         "MaxRollingFiles": 5,
         "Append": true
       }
     },
     "FredApiKey": "Your_FRED_API_Key",
     "ObservationStart": "1980-01-01"
   }
   ```

3. **Install Dependencies**:
   Install the required NuGet packages:
   ```bash
   dotnet restore
   ```

4. **Database Migrations**:
   Set up the database by applying migrations:
   ```bash
   dotnet ef database update --project EconomicDataTracker.Entities
   ```

### Running the Application

To run the application, execute the following command from the project directory:

```bash
dotnet run --project EconomicDataTracker.FredAPI
```

The application will:
- Pull CPI data from the FRED API.
- Log output to both console and a log file.
- Store data in the specified database.

## Scheduled Data Updates

To automate data updates:
- Set up the console application as a scheduled task (e.g., using Windows Task Scheduler or a cron job).
- Configure `ObservationStart` in `appsettings.json` to dynamically pull only recent data.

## Extending the Project

This project is designed to be modular, so additional data sources can be added with minimal setup:
- **New API Console App**: Create a new console application within the solution.
- **Custom RequestManager**: Implement a request manager for each new API, leveraging the common `RequestManager` base class.
- **Data Models**: Add new data models in `Entities` to store additional data types.

## Contributing

Contributions are welcome! Feel free to fork this repo, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License.
