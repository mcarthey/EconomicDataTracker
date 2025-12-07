# Local Development Guide

This guide will help you run the Economic Data Tracker application locally using SQLite for easy setup.

## Prerequisites

- .NET 10.0 SDK
- Node.js 18+ and npm (for Angular frontend)
- Your favorite code editor (VS Code, Visual Studio, Rider, etc.)

## Quick Start

### Step 1: Restore NuGet Packages

```bash
dotnet restore
```

### Step 2: Set Up Database (SQLite)

The application is configured to use SQLite for local development, which requires no separate database server installation.

#### 2.1: Navigate to Migrations Project

```bash
cd EconomicDataTracker.Migrations
```

#### 2.2: Set Environment Variable

**PowerShell (Windows):**
```powershell
$env:ASPNETCORE_ENVIRONMENT="Local"
```

**Bash (Mac/Linux):**
```bash
export ASPNETCORE_ENVIRONMENT=Local
```

#### 2.3: Apply Migrations

Apply ConfigContext migrations (configuration database):
```bash
dotnet ef database update --context ConfigDbContext
```

Apply ApplicationContext migrations (economic data database):
```bash
dotnet ef database update --context ApplicationDbContext
```

This will create `EconomicDataTracker.db` in the Migrations folder and seed it with:
- FRED API configuration (API key: `491753c292a9bdcded5d33422e4306b8`)
- 20 economic series to track (GDP, unemployment, inflation, etc.)

### Step 3: Fetch Initial Data from FRED API

Navigate to the Console project and run it to fetch the latest economic data:

```bash
cd ../EconomicDataTracker.Console
dotnet run
```

This will:
- Connect to the FRED API
- Fetch observations for all 20 configured economic series
- Store the data in the SQLite database

**Note:** The Console app will create its own copy of the database in its output folder. The data is fetched from [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/).

### Step 4: Run the API Backend

Open a new terminal and navigate to the API project:

```bash
cd ../EconomicDataTracker.Api
$env:ASPNETCORE_ENVIRONMENT="Local"  # Windows PowerShell
# or
export ASPNETCORE_ENVIRONMENT=Local   # Mac/Linux

dotnet run
```

The API will start on `http://localhost:5000`

You can verify it's working by visiting:
- Swagger UI: `http://localhost:5000/swagger`
- Health check: `http://localhost:5000/api/series`

### Step 5: Run the Angular Frontend

Open another terminal and navigate to the Web project:

```bash
cd ../EconomicDataTracker.Web
npm install
npm start
```

The Angular app will start on `http://localhost:4200`

## What You Should See

1. **Dashboard** - Summary cards showing latest values for key economic indicators
2. **Interactive Charts** - Time-series visualizations using Chart.js
3. **Filters** - Ability to filter by:
   - Economic indicators (select multiple series)
   - Time periods (1 month, 3 months, 6 months, 1 year, YTD, all time)
   - Custom date ranges

## Economic Indicators Tracked

The application tracks 20 economic series from FRED:

**Employment & Labor:**
- Unemployment Rate (UNRATE)
- Nonfarm Payrolls (PAYEMS)
- Labor Force Participation Rate (CIVPART)

**Prices & Inflation:**
- Consumer Price Index (CPIAUCSL)
- Core CPI (CPILFESL)
- Producer Price Index (PPIACO)

**Economic Activity:**
- GDP (GDP)
- Real GDP (GDPC1)
- Industrial Production (INDPRO)
- Retail Sales (RSXFS)

**Housing:**
- Housing Starts (HOUST)
- Home Sales (HSN1F)
- Case-Shiller Home Price Index (CSUSHPISA)

**Financial:**
- 10-Year Treasury Yield (DGS10)
- Fed Funds Rate (DFF)
- S&P 500 (SP500)

**Consumer:**
- Consumer Confidence (UMCSENT)
- Personal Consumption Expenditures (PCE)

**Trade & Manufacturing:**
- Trade Balance (BOPGSTB)
- Manufacturing PMI (MANEMP)

## Troubleshooting

### Database File Location

The SQLite database file (`EconomicDataTracker.db`) will be created in:
- `EconomicDataTracker.Migrations/bin/Debug/net10.0/` - when running migrations
- `EconomicDataTracker.Console/bin/Debug/net10.0/` - when running the console app
- `EconomicDataTracker.Api/bin/Debug/net10.0/` - when running the API

**Important:** Make sure to run the Console app to populate data before using the API/Web app!

### CORS Errors

If you see CORS errors in the browser console, make sure:
1. The API is running on `http://localhost:5000`
2. The Angular app is running on `http://localhost:4200`
3. Both are configured to use the Local environment

### No Data Showing

If the dashboard is empty:
1. Verify the database was created (check for `EconomicDataTracker.db` file)
2. Run the Console app to fetch data from FRED API
3. Check the API logs for any errors
4. Verify the Angular app is calling the correct API endpoint

### Migration Errors

If you encounter migration errors:
1. Delete the `EconomicDataTracker.db` file
2. Re-run both migration commands
3. Run the Console app again to fetch data

## Using SQL Server Instead of SQLite

If you prefer to use SQL Server (LocalDB or full SQL Server), update the connection string in:
- `SharedConfig/appsettings.Local.json`
- `EconomicDataTracker.Api/appsettings.Local.json`

Change from:
```json
"DefaultConnection": "Data Source=EconomicDataTracker.db"
```

To:
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EconomicDataTracker;Trusted_Connection=True;TrustServerCertificate=True;"
```

The application will automatically detect and use SQL Server based on the connection string format.

## Next Steps

- Customize the economic series being tracked (see `EconomicDataTracker.Migrations/ApplicationContext/Scripts/SeedFredSeries.sql`)
- Add more visualizations to the dashboard
- Schedule the Console app to run periodically to keep data up-to-date
- Deploy to Azure, AWS, or your preferred cloud provider

## Getting Help

If you encounter issues:
1. Check the application logs in the `Logs` folder
2. Review the FRED API documentation: https://fred.stlouisfed.org/docs/api/
3. Ensure your FRED API key is valid (you can get a free key at https://fred.stlouisfed.org/docs/api/api_key.html)
