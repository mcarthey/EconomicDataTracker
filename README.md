# Economic Data Tracker

A full-stack application designed to track, visualize, and analyze key economic indicators over time. Built to measure the impact of policy decisions on economic metrics, this system collects data from the FRED (Federal Reserve Economic Data) API and provides an interactive web dashboard for visualization and analysis.

## Features

### Backend (Data Collection & API)
- **Automated Data Collection**: Pulls economic data from the FRED API for 20+ indicators
- **Historical and Incremental Updates**: Smart update tracking to pull only new data, avoiding redundant API calls
- **RESTful Web API**: ASP.NET Core Web API with Swagger documentation
- **Repository Pattern**: Clean separation of concerns with Unit of Work pattern
- **Database Storage**: SQL Server with Entity Framework Core
- **Comprehensive Logging**: File and console logging with NReco.Logging.File

### Frontend (Dashboard & Visualization)
- **Interactive Dashboard**: Angular-based SPA with real-time data visualization
- **Summary Cards**: Latest values and percentage changes for all indicators
- **Interactive Charts**: Line charts with Chart.js showing trends over time
- **Advanced Filtering**:
  - Select specific economic indicators
  - Time period selection (1 month to 10 years)
  - Custom date range filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Shareable URLs**: Deep linking support for specific indicators and comparisons

### Economic Indicators Tracked
- Consumer Price Index (CPI)
- Unemployment Rate
- Real GDP
- Federal Funds Rate
- Total Nonfarm Payrolls
- Personal Consumption Expenditures
- Industrial Production Index
- S&P 500 Index
- 10-Year Treasury Rate
- 30-Year Mortgage Rate
- And 10 more indicators...

## Architecture

### Solution Structure

```
EconomicDataTracker/
├── EconomicDataTracker.Api/              [ASP.NET Core Web API]
│   ├── Controllers/                      (REST API endpoints)
│   ├── ViewModels/                       (DTOs for API responses)
│   └── Program.cs                        (API configuration & DI)
│
├── EconomicDataTracker.Web/              [Angular Frontend]
│   ├── src/app/
│   │   ├── components/                   (Dashboard, Charts, Filters)
│   │   ├── services/                     (API integration)
│   │   └── models/                       (TypeScript interfaces)
│   └── package.json
│
├── EconomicDataTracker.Console/          [Data Collection Service]
│   ├── Services/                         (MainService orchestration)
│   ├── Requesters/                       (FRED API integration)
│   └── Mappers/                          (JSON to entity mapping)
│
├── EconomicDataTracker.Entities/         [Data Access Layer]
│   ├── Models/                           (EF Core entities)
│   ├── Data/                             (DbContext)
│   └── Repositories/                     (Repository pattern)
│
├── EconomicDataTracker.Migrations/       [Database Migrations]
│   ├── ApplicationContext/               (Main data migrations)
│   └── ConfigContext/                    (Configuration migrations)
│
├── EconomicDataTracker.Common.*/         [Shared Libraries]
│   ├── Common.Config                     (Configuration management)
│   ├── Common.Entities                   (Shared helpers)
│   ├── Common.Logging                    (Logging infrastructure)
│   └── Common.Requests                   (HTTP request management)
│
└── EconomicDataTracker.Tests/            [Unit Tests]
```

### Technology Stack

**Backend:**
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger/OpenAPI

**Frontend:**
- Angular 17
- TypeScript
- Chart.js / ng2-charts
- RxJS
- Modern CSS (responsive design)

**Data Source:**
- Federal Reserve Economic Data (FRED) API

## Getting Started

### Prerequisites

**Backend:**
- **.NET SDK**: [.NET 8.0 or later](https://dotnet.microsoft.com/download/dotnet)
- **SQL Server**: SQL Server 2019 or later (or SQL Server Express)
- **FRED API Key**: Sign up at [FRED](https://fred.stlouisfed.org/docs/api/api_key.html) to obtain an API key

**Frontend:**
- **Node.js**: v18 or later
- **npm**: v9 or later
- **Angular CLI**: v17 or later

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

#### 1. Run the Data Collection Service (Optional - if you need to collect data)

```bash
dotnet run --project EconomicDataTracker.Console
```

This will:
- Connect to the FRED API
- Pull data for all enabled economic series
- Store observations in the database
- Track update timestamps for incremental pulls

#### 2. Run the Web API

```bash
dotnet run --project EconomicDataTracker.Api
```

The API will start on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

Access Swagger documentation at: `http://localhost:5000` or `https://localhost:5001`

#### 3. Run the Angular Frontend

```bash
cd EconomicDataTracker.Web
npm install
npm start
```

The dashboard will be available at: `http://localhost:4200`

### API Endpoints

The Web API provides the following endpoints:

**Series Endpoints:**
- `GET /api/series` - Get all economic series
- `GET /api/series/{id}` - Get a specific series
- `GET /api/series/{id}/observations` - Get series with observations

**Observations Endpoints:**
- `GET /api/observations` - Get filtered observations
- `GET /api/observations/latest` - Get latest observation for each series

**Dashboard Endpoints:**
- `GET /api/dashboard/summary` - Get dashboard summary (latest values & changes)
- `GET /api/dashboard/trends` - Get trend data for specified time period

All endpoints support filtering by:
- Series IDs (comma-separated)
- Date ranges (startDate, endDate)
- Time periods (1month, 3months, 6months, 1year, 2years, 5years, 10years)

## Scheduled Data Updates

To automate data updates:
- Set up the console application as a scheduled task (e.g., using Windows Task Scheduler or a cron job).
- Configure `ObservationStart` in `appsettings.json` to dynamically pull only recent data.

## Deployment

### Backend Deployment Options

1. **Azure App Service** (Recommended)
   - Deploy the Web API to Azure App Service
   - Use Azure SQL Database for the data store
   - Configure Application Settings for connection strings

2. **Docker Container**
   - Build a Docker image of the API
   - Deploy to Azure Container Instances, AWS ECS, or Kubernetes

3. **On-Premises/VPS**
   - Deploy to Windows Server with IIS
   - Or run as a standalone Kestrel server on Linux

### Frontend Deployment Options

1. **Azure Static Web Apps** (Recommended)
   - Free tier available
   - Integrated CI/CD with GitHub
   - Built-in SSL certificate
   - Global CDN

2. **Other Static Hosting Services**
   - AWS S3 + CloudFront
   - Netlify
   - Vercel
   - GitHub Pages

### Deployment Steps

#### Backend (API)
```bash
# Publish the API
dotnet publish EconomicDataTracker.Api -c Release -o ./publish

# The published files can be deployed to your hosting service
```

#### Frontend (Angular)
```bash
# Build for production
cd EconomicDataTracker.Web
ng build --configuration production

# Deploy the contents of dist/economic-data-tracker-web to your static hosting service
```

**Important:** Update `src/environments/environment.prod.ts` with your production API URL before building.

## Configuration

### Backend Configuration

Connection strings and API keys are stored in `SharedConfig/appsettings.Dev.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EconomicDataTracker;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

FRED API configuration is stored in the database (ConfigurationEntries table):
- `FredApiKey`: Your FRED API key
- `FredBaseUrl`: FRED API base URL

### Frontend Configuration

API endpoint is configured in `EconomicDataTracker.Web/src/environments/`:
- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

## Database Migrations

The project uses two separate database contexts:

**ApplicationContext** (Main data):
```bash
# Add a new migration
dotnet ef migrations add MigrationName --project EconomicDataTracker.Migrations --context ApplicationDbContext

# Update database
dotnet ef database update --project EconomicDataTracker.Migrations --context ApplicationDbContext
```

**ConfigContext** (Configuration):
```bash
# Add a new migration
dotnet ef migrations add MigrationName --project EconomicDataTracker.Migrations --context ConfigDbContext

# Update database
dotnet ef database update --project EconomicDataTracker.Migrations --context ConfigDbContext
```

Or use the included PowerShell helper scripts:
- `Add-Migration.ps1` - Add a new migration
- `Update-Database.ps1` - Apply migrations to database
- `Remove-Migration.ps1` - Remove the last migration

## Extending the Project

This project is designed to be modular and extensible:

### Adding New Economic Indicators

1. Add series to the database via seed migration
2. Enable the series by setting `Enabled = true`
3. Run the data collection service

### Adding New Data Sources

1. Create a new requester implementing the `RequestManager` base class
2. Add corresponding mapper for the API response format
3. Create new entity models if needed
4. Update the repositories

### Customizing the Dashboard

1. Add new components in `EconomicDataTracker.Web/src/app/components/`
2. Create new API endpoints if needed
3. Update the dashboard component to include new visualizations

## Contributing

Contributions are welcome! Feel free to fork this repo, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License.
