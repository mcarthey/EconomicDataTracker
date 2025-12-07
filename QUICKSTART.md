# Economic Data Tracker - Quick Start Guide

Get the Economic Data Tracker up and running in **5 minutes** using SQLite (no database server needed!).

## Prerequisites

- **.NET 10 SDK**: [Download here](https://dotnet.microsoft.com/download/dotnet)
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Your terminal** of choice (PowerShell, bash, zsh, etc.)

That's it! No SQL Server installation required.

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/EconomicDataTracker.git
cd EconomicDataTracker
```

## Step 2: Set Up the Database (SQLite)

### 2.1: Set Environment to Local

**Windows (PowerShell):**
```powershell
$env:ASPNETCORE_ENVIRONMENT="Local"
```

**Mac/Linux (bash/zsh):**
```bash
export ASPNETCORE_ENVIRONMENT=Local
```

### 2.2: Apply Database Migrations

Navigate to the Migrations project:

```bash
cd EconomicDataTracker.Migrations
```

Create the configuration database:

```bash
dotnet ef database update --context ConfigDbContext
```

Create the main data database:

```bash
dotnet ef database update --context ApplicationDbContext
```

✅ **Done!** This creates `EconomicDataTracker.db` with:
- Configuration (FRED API key already seeded)
- 20 economic series ready to track
- Schema for storing observations

## Step 3: Fetch Economic Data

Navigate to the Console project:

```bash
cd ../EconomicDataTracker.Console
```

Run the data collection service:

```bash
dotnet run
```

This will:
- ✅ Connect to the FRED (Federal Reserve Economic Data) API
- ✅ Fetch historical data for 20 economic indicators
- ✅ Store observations in your local SQLite database

⏱️ **Takes 30-60 seconds** depending on your connection.

You should see output like:
```
Fetching data for UNRATE (Unemployment Rate)...
Fetched 500 observations for UNRATE
Fetching data for GDP (Gross Domestic Product)...
Fetched 300 observations for GDP
...
```

## Step 4: Start the API Backend

Open a **new terminal** window and navigate to the API project:

```bash
cd EconomicDataTracker.Api
```

Set the environment variable again (new terminal):

**Windows:**
```powershell
$env:ASPNETCORE_ENVIRONMENT="Local"
```

**Mac/Linux:**
```bash
export ASPNETCORE_ENVIRONMENT=Local
```

Start the API:

```bash
dotnet run
```

✅ **API is running!** You'll see:
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

### Verify the API

Open your browser and go to:
- **Swagger UI**: http://localhost:5000/swagger
- **Test Endpoint**: http://localhost:5000/api/series

You should see JSON data for all the economic series.

## Step 5: Start the Angular Dashboard

Open **another terminal** window and navigate to the Web project:

```bash
cd EconomicDataTracker.Web
```

Install dependencies (first time only):

```bash
npm install
```

Start the development server:

```bash
npm start
```

✅ **Dashboard is running!**

The Angular app will open automatically at: **http://localhost:4200**

If it doesn't open automatically, open your browser to http://localhost:4200

## What You'll See

### Dashboard Overview

The dashboard displays:

1. **Summary Cards** - Latest values for key indicators:
   - Unemployment Rate
   - GDP
   - Consumer Price Index (CPI)
   - S&P 500
   - And more...

2. **Percentage Changes** - How each indicator changed since the previous period

3. **Interactive Charts** - Line charts showing trends over time

4. **Filters**:
   - **Indicator Selector**: Choose which economic indicators to display
   - **Time Period Buttons**: Quick filters (1M, 3M, 6M, 1Y, YTD, All)
   - **Custom Date Range**: Pick specific start and end dates

### Try It Out!

**Filter by Indicator:**
1. Click the "Select Indicators" dropdown
2. Choose 2-3 indicators (e.g., Unemployment, GDP, CPI)
3. Click outside to close
4. Charts update automatically

**Change Time Period:**
1. Click "1Y" button to see the last year
2. Try "YTD" to see year-to-date
3. Or use the date pickers for a custom range

**Explore the Data:**
- Hover over chart lines to see exact values
- Scroll down to see all 20 indicators
- Watch how different indicators correlate

## Economic Indicators Available

The dashboard tracks 20 key economic indicators:

### Employment & Labor
- 📊 **Unemployment Rate** (UNRATE) - Percentage of unemployed
- 💼 **Nonfarm Payrolls** (PAYEMS) - Total employed (millions)
- 👥 **Labor Force Participation** (CIVPART) - Percentage in workforce

### Prices & Inflation
- 💵 **Consumer Price Index** (CPIAUCSL) - General inflation
- 🏷️ **Core CPI** (CPILFESL) - Inflation excluding food/energy
- 🏭 **Producer Price Index** (PPIACO) - Wholesale inflation

### Economic Activity
- 📈 **GDP** (GDP) - Total economic output
- 💰 **Real GDP** (GDPC1) - Inflation-adjusted GDP
- 🏗️ **Industrial Production** (INDPRO) - Manufacturing output
- 🛒 **Retail Sales** (RSXFS) - Consumer spending

### Housing
- 🏠 **Housing Starts** (HOUST) - New construction
- 🏡 **Home Sales** (HSN1F) - Existing home sales
- 📊 **Case-Shiller Index** (CSUSHPISA) - Home prices

### Financial Markets
- 📉 **10-Year Treasury** (DGS10) - Bond yield
- 🏦 **Fed Funds Rate** (DFF) - Interest rate benchmark
- 📊 **S&P 500** (SP500) - Stock market index

### Consumer
- 😊 **Consumer Confidence** (UMCSENT) - Sentiment index
- 💳 **Personal Consumption** (PCE) - Consumer spending

### Trade & Manufacturing
- 🌍 **Trade Balance** (BOPGSTB) - Exports minus imports
- 🏭 **Manufacturing Employment** (MANEMP) - Factory jobs

All data comes from the [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/) API.

## Troubleshooting

### "dotnet: command not found"

**Solution**: Install the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet)

Verify installation:
```bash
dotnet --version
```

### "npm: command not found"

**Solution**: Install [Node.js](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### "A network-related or instance-specific error occurred..."

**Cause**: You're using the wrong environment configuration (SQL Server instead of SQLite)

**Solution**: Make sure you set `ASPNETCORE_ENVIRONMENT=Local` before running migrations and the app

### Dashboard Shows "No Data"

**Cause**: The Console app hasn't been run yet

**Solution**:
1. Stop the API (Ctrl+C)
2. Navigate to `EconomicDataTracker.Console`
3. Run `dotnet run`
4. Wait for data fetching to complete
5. Restart the API

### CORS Errors in Browser

**Symptom**: Browser console shows CORS policy errors

**Cause**: API might not be running or running on wrong port

**Solution**:
1. Verify API is running on http://localhost:5000
2. Check `EconomicDataTracker.Web/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

### SQLite Database File Not Found

**Symptom**: "Unable to open database file"

**Solution**:
- Make sure you ran migrations from the `EconomicDataTracker.Migrations` folder
- Check that `EconomicDataTracker.db` exists in `EconomicDataTracker.Migrations/bin/Debug/net10.0/`

### Can't Connect to FRED API

**Symptom**: "Failed to fetch data" errors

**Possible Causes**:
1. No internet connection
2. FRED API is down (rare)
3. Rate limit exceeded (500 calls per day on free tier)

**Solution**:
- Check your internet connection
- Try again later if rate limited
- (Optional) Get your own FRED API key at https://fred.stlouisfed.org/docs/api/api_key.html

## Next Steps

### Customize the Experience

**1. Change the FRED API Key** (Optional)

The default key is included for demo purposes. For production use, get your own:

1. Sign up at https://fred.stlouisfed.org/docs/api/api_key.html
2. Update in database:
   ```sql
   UPDATE ConfigurationEntries
   SET Value = 'your_new_api_key'
   WHERE Key = 'FredApiKey'
   ```

**2. Add/Remove Economic Indicators**

Edit `EconomicDataTracker.Migrations/ApplicationContext/Scripts/SeedFredSeries.sql`

Add a new series:
```sql
INSERT INTO FredSeries (SeriesId, Name, Description, Units, Frequency, Enabled)
VALUES ('MORTGAGE30US', '30-Year Mortgage Rate', 'Average 30-year fixed mortgage rate', 'Percent', 'Weekly', 1)
```

**3. Schedule Automatic Updates**

**Windows (Task Scheduler):**
1. Create a batch file to run the Console app
2. Schedule it to run daily at 6 AM

**Mac/Linux (Cron):**
```bash
# Add to crontab
0 6 * * * cd /path/to/EconomicDataTracker.Console && dotnet run
```

**Azure (Recommended for Production):**
- Deploy Console app as an Azure Function with Timer Trigger
- Runs serverless on a schedule

### Deploy to Production

See [README.md](README.md) for deployment options:
- **Backend**: Azure App Service, Docker, or VPS
- **Frontend**: Azure Static Web Apps (free tier), Netlify, Vercel
- **Database**: Azure SQL Database or SQL Server

### Learn More

- **Architecture**: Read [ARCHITECTURE.md](ARCHITECTURE.md) for in-depth design explanations
- **Full Documentation**: See [README.md](README.md) for complete feature list
- **FRED API Docs**: https://fred.stlouisfed.org/docs/api/

## Summary

You now have a fully functional economic data tracker running locally!

**What's Running:**
- ✅ SQLite database with 20 economic series and historical data
- ✅ ASP.NET Core Web API on http://localhost:5000
- ✅ Angular dashboard on http://localhost:4200

**You Can:**
- 📊 View latest values for all economic indicators
- 📈 See trends over time with interactive charts
- 🔍 Filter by indicator and time period
- 🎯 Track how the economy is performing

**Next Time You Want to Run:**
1. Terminal 1: `cd EconomicDataTracker.Api && dotnet run`
2. Terminal 2: `cd EconomicDataTracker.Web && npm start`
3. (Optional) Update data: `cd EconomicDataTracker.Console && dotnet run`

Enjoy tracking the economy! 🚀
