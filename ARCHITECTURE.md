# Economic Data Tracker - Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Architectural Principles](#architectural-principles)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [Cross-Cutting Concerns](#cross-cutting-concerns)
- [Deployment Architecture](#deployment-architecture)

## Overview

The Economic Data Tracker is a full-stack .NET application designed with clean architecture principles, following SOLID design patterns and separation of concerns. The system consists of three main components:

1. **Data Collection Service** (Console Application) - Fetches economic data from FRED API
2. **RESTful Web API** (ASP.NET Core) - Exposes data through REST endpoints
3. **Web Dashboard** (Angular SPA) - Provides interactive visualization

## Architectural Principles

### 1. Separation of Concerns
The solution is divided into distinct projects, each with a single, well-defined responsibility:
- **Presentation Layer**: Angular SPA and Web API controllers
- **Business Logic Layer**: Services and domain logic
- **Data Access Layer**: Repositories and Entity Framework DbContexts
- **Infrastructure Layer**: Logging, configuration, HTTP requests

### 2. Dependency Inversion
- High-level modules do not depend on low-level modules
- Both depend on abstractions (interfaces)
- Enables testability and flexibility
- Uses Dependency Injection throughout

### 3. Single Responsibility Principle
Each project and class has one reason to change:
- `EconomicDataTracker.Entities` - Data models and persistence
- `EconomicDataTracker.Api` - HTTP API exposure
- `EconomicDataTracker.Console` - Data collection orchestration
- `EconomicDataTracker.Common.*` - Shared utilities

### 4. Open/Closed Principle
The system is designed to be:
- **Open for extension**: Easy to add new economic indicators, data sources, or visualizations
- **Closed for modification**: Core abstractions remain stable

### 5. Don't Repeat Yourself (DRY)
Common functionality is centralized:
- `Common.Entities` - Shared EF Core configuration
- `Common.Config` - Configuration management
- `Common.Requests` - HTTP request handling
- `Common.Logging` - Logging infrastructure

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│                     (Angular SPA)                            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/JSON
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  ASP.NET Core Web API                        │
│              (Controllers + ViewModels)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Repository Pattern
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Data Access Layer                               │
│         (Repositories + Unit of Work + EF Core)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Database Layer                             │
│             (SQL Server / SQLite)                            │
└──────────────────────────────────────────────────────────────┘
         ▲
         │
         │ Writes economic data
         │
┌────────┴──────────────────────────────────────────────────┐
│          Console Application                               │
│         (Data Collection Service)                          │
└────────┬──────────────────────────────────────────────────┘
         │
         │ HTTP GET
         │
┌────────▼──────────────────────────────────────────────────┐
│              FRED API                                       │
│    (Federal Reserve Economic Data)                         │
└────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### 1. Angular SPA (EconomicDataTracker.Web)
**Purpose**: User interface and data visualization

**Responsibilities**:
- Display economic indicators in summary cards
- Render interactive time-series charts
- Handle user filtering and date range selection
- Communicate with the Web API
- Client-side state management

**Key Technologies**:
- Angular 17 (standalone components)
- TypeScript with strict null checking
- RxJS for reactive programming
- Chart.js for data visualization
- Responsive CSS

#### 2. ASP.NET Core Web API (EconomicDataTracker.Api)
**Purpose**: HTTP API for data access

**Responsibilities**:
- Expose REST endpoints for economic data
- Transform domain entities to ViewModels (DTOs)
- Handle CORS for SPA access
- Provide Swagger/OpenAPI documentation
- Dependency injection configuration

**Key Patterns**:
- Controller pattern (MVC)
- DTO pattern (ViewModels)
- Dependency Injection

#### 3. Console Application (EconomicDataTracker.Console)
**Purpose**: Automated data collection from FRED API

**Responsibilities**:
- Orchestrate data fetching for all enabled series
- Transform JSON responses to domain entities
- Track last update timestamps for incremental fetches
- Handle API errors and logging
- Can be scheduled as a background job

**Key Patterns**:
- Template Method (RequestManager base class)
- Strategy pattern (different requesters for different APIs)
- Mapper pattern (JSON to entity transformation)

#### 4. Data Access Layer (EconomicDataTracker.Entities)
**Purpose**: Database access and entity management

**Responsibilities**:
- Define domain entities (FredSeries, FredObservation)
- Implement repository pattern
- Configure Entity Framework mappings
- Provide Unit of Work for transaction management
- Support both SQL Server and SQLite

**Key Patterns**:
- Repository pattern
- Unit of Work pattern
- DbContext (Entity Framework)

#### 5. Database Migrations (EconomicDataTracker.Migrations)
**Purpose**: Version control for database schema

**Responsibilities**:
- Define database schema changes
- Seed initial data (series, configuration)
- Provide rollback scripts
- Support multiple DbContexts (Application, Config)

**Design Decision**: Separate project for migrations allows:
- Centralized migration history
- Easier deployment scripting
- Clean separation from domain logic

#### 6. Common Libraries (EconomicDataTracker.Common.*)

##### Common.Entities
- Shared EF Core configuration helpers
- Generic DbContext factory for design-time
- Service collection extensions for DI
- Database provider detection (SQL Server vs SQLite)

##### Common.Config
- Configuration repository pattern
- Database-driven configuration management
- Allows runtime configuration changes

##### Common.Logging
- Structured logging abstraction
- File and console logging providers
- Configurable log levels

##### Common.Requests
- Base class for HTTP API requesters
- Authentication handling (API keys, Basic, Bearer)
- Error handling and logging
- Extensible for new data sources

## Project Structure

```
EconomicDataTracker/
│
├── EconomicDataTracker.Api/
│   ├── Controllers/
│   │   ├── DashboardController.cs      - Dashboard aggregation endpoints
│   │   ├── SeriesController.cs         - Series CRUD operations
│   │   └── ObservationsController.cs   - Observation queries
│   ├── ViewModels/
│   │   ├── SeriesViewModel.cs          - Series DTO
│   │   ├── ObservationViewModel.cs     - Observation DTO
│   │   └── DashboardSummaryViewModel.cs - Dashboard data DTO
│   ├── Program.cs                       - DI configuration, middleware
│   └── appsettings.json                 - API configuration
│
├── EconomicDataTracker.Web/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── dashboard/              - Main dashboard component
│   │   │   ├── indicator-chart/        - Reusable chart component
│   │   │   ├── series-selector/        - Multi-select dropdown
│   │   │   └── date-range-filter/      - Date picker component
│   │   ├── services/
│   │   │   └── economic-data.service.ts - API integration
│   │   ├── models/
│   │   │   └── economic-data.models.ts  - TypeScript interfaces
│   │   └── environments/
│   │       ├── environment.ts           - Dev config
│   │       └── environment.prod.ts      - Production config
│   └── package.json
│
├── EconomicDataTracker.Console/
│   ├── Services/
│   │   └── MainService.cs              - Orchestrates data fetching
│   ├── Requesters/
│   │   └── FredApiRequester.cs         - FRED-specific API client
│   ├── Mappers/
│   │   └── FredObservationMapper.cs    - JSON to entity mapper
│   ├── Models/
│   │   └── FredApiResponse.cs          - JSON response models
│   └── Program.cs                       - Entry point, DI setup
│
├── EconomicDataTracker.Entities/
│   ├── Data/
│   │   ├── ApplicationDbContext.cs     - Main data context
│   │   └── ConfigDbContext.cs          - Config context
│   ├── Models/
│   │   ├── FredSeries.cs               - Economic series entity
│   │   ├── FredObservation.cs          - Data point entity
│   │   └── FredObservationUpdateTracker.cs - Incremental fetch tracking
│   ├── Repositories/
│   │   ├── IRepository.cs              - Generic repository interface
│   │   ├── FredSeriesRepository.cs     - Series-specific queries
│   │   └── FredObservationRepository.cs - Observation queries
│   └── UnitOfWork/
│       └── IUnitOfWork.cs              - Transaction boundary
│
├── EconomicDataTracker.Migrations/
│   ├── ApplicationContext/
│   │   ├── Migrations/                 - EF Core migrations
│   │   ├── Scripts/                    - SQL seed scripts
│   │   └── ApplicationContextDesignTimeFactory.cs
│   └── ConfigContext/
│       ├── Migrations/
│       ├── Scripts/
│       └── ConfigContextDesignTimeFactory.cs
│
├── EconomicDataTracker.Common.Config/
│   ├── Models/
│   │   └── ConfigurationEntry.cs      - Config key-value entity
│   └── Repositories/
│       └── ConfigRepository.cs         - Config data access
│
├── EconomicDataTracker.Common.Entities/
│   ├── Helpers/
│   │   ├── ConfigurationHelper.cs      - Config loading utility
│   │   └── MigrationHelper.cs          - SQL script loader for migrations
│   ├── DbContextFactories/
│   │   └── GenericDbContextFactory.cs  - Design-time DbContext creation
│   ├── ServiceCollectionExtensions.cs  - DI registration helpers
│   └── BaseMigration.cs                - Custom migration base class
│
├── EconomicDataTracker.Common.Logging/
│   └── Logger.cs                       - Logging abstraction
│
├── EconomicDataTracker.Common.Requests/
│   └── RequestManager.cs               - Base HTTP requester
│
└── SharedConfig/
    ├── appsettings.Dev.json            - Development settings
    ├── appsettings.Local.json          - Local SQLite settings
    └── appsettings.Production.json     - Production settings (template)
```

## Design Patterns

### 1. Repository Pattern
**Purpose**: Abstract data access logic from business logic

**Implementation**:
```csharp
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}
```

**Benefits**:
- Testability (can mock repositories)
- Centralized query logic
- Easy to swap data providers

### 2. Unit of Work Pattern
**Purpose**: Manage transactions across multiple repositories

**Implementation**:
```csharp
public interface IUnitOfWork : IDisposable
{
    IFredSeriesRepository FredSeriesRepository { get; }
    IFredObservationRepository FredObservationRepository { get; }
    IFredObservationUpdateTrackerRepository FredObservationUpdateTrackerRepository { get; }
    Task<int> SaveChangesAsync();
}
```

**Benefits**:
- Atomic operations across multiple tables
- Consistent transaction boundaries
- Prevents partial updates

### 3. Template Method Pattern
**Purpose**: Define skeleton of API request handling

**Implementation**:
```csharp
public abstract class RequestManager
{
    protected abstract string GetBaseUrl();
    protected abstract string GetAuthenticationType();

    protected virtual async Task<string> ExecuteRequestAsync(...)
    {
        // Common request logic
    }
}
```

**Benefits**:
- Reusable HTTP logic
- Easy to add new API sources
- Consistent error handling

### 4. Factory Pattern
**Purpose**: Create DbContext instances for EF Core design-time tools

**Implementation**:
```csharp
public class GenericDbContextFactory<TContext> : IDesignTimeDbContextFactory<TContext>
    where TContext : DbContext
{
    public TContext CreateDbContext(string[] args)
    {
        // Auto-detect SQL Server vs SQLite
        // Configure options
        // Return configured context
    }
}
```

**Benefits**:
- DRY for multiple DbContexts
- Centralized database provider detection
- Easy migrations workflow

### 5. DTO (Data Transfer Object) Pattern
**Purpose**: Decouple API contracts from domain entities

**Implementation**:
```csharp
// Domain Entity
public class FredSeries
{
    public int Id { get; set; }
    public string SeriesId { get; set; }
    public string Name { get; set; }
    // ... navigation properties
}

// DTO / ViewModel
public class SeriesViewModel
{
    public int Id { get; set; }
    public string SeriesId { get; set; }
    public string Name { get; set; }
    // No navigation properties - flat structure
}
```

**Benefits**:
- API versioning flexibility
- Hide internal structure
- Prevent over-posting attacks
- Optimized JSON serialization

## Data Flow

### Data Collection Flow

```
1. Console App starts
   └─> MainService.RunAsync()
        └─> Get all enabled FredSeries from database
             └─> For each series:
                  ├─> Check FredObservationUpdateTracker for last update
                  ├─> FredApiRequester.FetchDataAsync(seriesId, lastUpdate)
                  │    └─> HTTP GET to FRED API
                  │         └─> Return JSON response
                  ├─> FredObservationMapper.Map(json)
                  │    └─> Parse JSON
                  │         └─> Create FredObservation entities
                  ├─> Save observations to database
                  └─> Update FredObservationUpdateTracker timestamp
```

### API Request Flow

```
1. Angular app makes HTTP request
   └─> http.get('http://localhost:5000/api/dashboard/summary')
        └─> ASP.NET Core routing
             └─> DashboardController.GetSummary()
                  ├─> Inject IUnitOfWork via DI
                  ├─> Call repository methods
                  │    └─> EF Core translates to SQL
                  │         └─> Query database
                  ├─> Map entities to ViewModels
                  └─> Return JSON response
                       └─> Angular receives data
                            └─> Display on dashboard
```

### End-to-End Data Flow

```
FRED API
   ↓ (JSON)
Console App (fetch & transform)
   ↓ (entities)
Database (persistent storage)
   ↓ (query)
Web API (expose via REST)
   ↓ (JSON/ViewModels)
Angular SPA (visualize)
   ↓ (rendered)
User Browser (interactive dashboard)
```

## Database Design

### Schema Overview

#### ApplicationContext (Main Data)

**FredSeries Table**
```
Id              INT (PK, Identity)
SeriesId        NVARCHAR(50) (UNIQUE) - e.g., "UNRATE", "GDP"
Name            NVARCHAR(255)          - Human-readable name
Description     NVARCHAR(MAX)          - Full description
Units           NVARCHAR(100)          - "Percent", "Billions of Dollars"
Frequency       NVARCHAR(50)           - "Monthly", "Quarterly"
Enabled         BIT                    - Is data collection enabled?
```

**FredObservations Table**
```
Id              INT (PK, Identity)
FredSeriesId    INT (FK -> FredSeries.Id)
Date            DATETIME2              - Observation date
Value           DECIMAL(18, 4)         - Economic value
CreatedAt       DATETIME2              - When record was created
```

**FredObservationUpdateTracker Table**
```
Id              INT (PK, Identity)
FredSeriesId    INT (FK -> FredSeries.Id)
LastUpdated     DATETIME2              - Last successful fetch
```

**Indexes**:
- `IX_FredObservations_Date` - Fast date range queries
- `IX_FredObservations_FredSeriesId` - Fast series lookups
- `IX_FredSeries_SeriesId` - Unique constraint + fast lookup

#### ConfigContext (Configuration)

**ConfigurationEntries Table**
```
Id              INT (PK, Identity)
Key             NVARCHAR(255) (UNIQUE) - "FredApiKey", "FredBaseUrl"
Value           NVARCHAR(MAX)          - Configuration value
```

### Entity Relationships

```
FredSeries (1) ─────< (N) FredObservations
    │
    └─────< (1) FredObservationUpdateTracker
```

### Database Provider Abstraction

The system supports **both SQL Server and SQLite** through automatic detection:

```csharp
public static void ConfigureDbContextOptions(DbContextOptionsBuilder optionsBuilder, string connectionString)
{
    // Auto-detect based on connection string
    if (connectionString.Contains("Data Source=") && !connectionString.Contains("Server="))
    {
        // SQLite for local development
        optionsBuilder.UseSqlite(connectionString, options =>
            options.MigrationsAssembly("EconomicDataTracker.Migrations"));
    }
    else
    {
        // SQL Server for production
        optionsBuilder.UseSqlServer(connectionString, options =>
            options.MigrationsAssembly("EconomicDataTracker.Migrations"));
    }
}
```

**Benefits**:
- **Local Development**: SQLite requires no server installation
- **Production**: SQL Server provides enterprise scalability
- **Seamless**: Same codebase, same migrations
- **Configuration-Driven**: Just change connection string

## API Design

### RESTful Principles

The API follows REST conventions:

- **Resource-based URLs**: `/api/series`, `/api/observations`
- **HTTP verbs**: GET for queries (read-only in current version)
- **Status codes**: 200 (OK), 404 (Not Found), 500 (Server Error)
- **JSON**: All responses in JSON format
- **Stateless**: Each request contains all necessary information

### Endpoint Design

#### Series Endpoints

```
GET /api/series
  → Returns all economic series
  → Response: SeriesViewModel[]

GET /api/series/{id}
  → Returns a single series by ID
  → Response: SeriesViewModel

GET /api/series/{id}/observations?startDate=&endDate=
  → Returns series with filtered observations
  → Response: SeriesWithObservationsViewModel
```

#### Observations Endpoints

```
GET /api/observations?seriesIds=1,2,3&startDate=2024-01-01&endDate=2024-12-31
  → Returns filtered observations across multiple series
  → Response: ObservationViewModel[]

GET /api/observations/latest
  → Returns the most recent observation for each series
  → Response: ObservationViewModel[]
```

#### Dashboard Endpoints

```
GET /api/dashboard/summary?seriesIds=1,2,3
  → Returns summary cards with latest values and percentage changes
  → Response: DashboardSummaryViewModel[]

GET /api/dashboard/trends?seriesIds=1,2,3&period=1year
  → Returns trend data for charts
  → Supports periods: 1month, 3months, 6months, 1year, ytd, all
  → Response: SeriesWithObservationsViewModel[]
```

### CORS Configuration

The API is configured to accept requests from the Angular SPA:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

**Production**: Update to allow your deployed domain.

## Frontend Architecture

### Angular Architecture

The frontend follows **Angular best practices**:

#### 1. Standalone Components (Angular 17+)
- No NgModules required
- Direct component imports
- Tree-shakeable by default
- Simpler mental model

#### 2. Component Structure

```
dashboard.component.ts
  ├─ indicator-chart.component.ts (reusable chart)
  ├─ series-selector.component.ts (multi-select dropdown)
  └─ date-range-filter.component.ts (date picker)
```

**Smart vs Presentational Components**:
- **Smart (Container)**: `DashboardComponent` - manages state, calls services
- **Presentational (Dumb)**: `IndicatorChartComponent` - receives inputs, emits outputs

#### 3. Services

```typescript
@Injectable({ providedIn: 'root' })
export class EconomicDataService {
  private apiUrl = environment.apiUrl;

  getAllSeries(): Observable<Series[]> { }
  getDashboardSummary(seriesIds?: number[]): Observable<DashboardSummary[]> { }
  getTrends(seriesIds?: number[], period?: string): Observable<SeriesTrend[]> { }
}
```

**Benefits**:
- Centralized API communication
- Reusable across components
- Easy to mock for testing

#### 4. RxJS Reactive Patterns

```typescript
// Combine multiple observables
combineLatest([
  this.economicDataService.getAllSeries(),
  this.economicDataService.getDashboardSummary()
]).subscribe(([series, summary]) => {
  // Update UI
});
```

#### 5. TypeScript Strict Mode

- Null-safety enforced
- Type checking at compile-time
- Better IDE support
- Fewer runtime errors

### State Management

**Current**: Component-based state (suitable for small app)

**Future**: If complexity grows, consider:
- NgRx (Redux pattern)
- Akita
- Component Store

## Cross-Cutting Concerns

### 1. Configuration Management

**Multi-Environment Support**:
- `appsettings.Dev.json` - Local development (SQL Server)
- `appsettings.Local.json` - Local development (SQLite)
- `appsettings.Production.json` - Production deployment

**Environment Variable**:
```bash
export ASPNETCORE_ENVIRONMENT=Local
```

**Database-Driven Config**:
- FRED API keys stored in ConfigurationEntries table
- Allows runtime updates without redeployment
- ConfigRepository provides typed access

### 2. Logging

**Multi-Provider Logging**:
- **Console**: For development debugging
- **File**: For production troubleshooting
- **Structured**: Supports correlation IDs, log levels

**Configuration**:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Warning"
    },
    "File": {
      "Path": "Logs/log.txt",
      "FileSizeLimitBytes": 10485760,
      "MaxRollingFiles": 5
    }
  }
}
```

### 3. Error Handling

**Console App**:
- Try-catch around API requests
- Logging of failures
- Continues to next series on error

**Web API**:
- Global exception handling middleware (future)
- Appropriate HTTP status codes
- Detailed error logging

**Angular**:
- RxJS error operators
- User-friendly error messages
- Retry logic for transient failures

### 4. Security

**Current**:
- CORS protection
- Connection string encryption (production)
- API keys in configuration, not code

**Future Enhancements**:
- Authentication/Authorization (JWT, OAuth)
- Rate limiting on API
- Input validation and sanitization
- SQL injection prevention (EF Core parameterizes queries)

## Deployment Architecture

### Development Environment

```
Developer Machine
  ├─ .NET 10 SDK
  ├─ Node.js 18+
  ├─ SQLite (embedded)
  └─ Visual Studio / VS Code / Rider
```

### Production Environment

#### Backend (API + Database)

**Option 1: Azure**
```
Azure App Service (API)
  ├─ .NET 10 runtime
  ├─ Auto-scaling enabled
  └─ Connected to Azure SQL Database
```

**Option 2: Docker**
```
Docker Container
  ├─ mcr.microsoft.com/dotnet/aspnet:10.0
  ├─ Published API binaries
  └─ Environment variables for config
```

**Option 3: On-Premises**
```
Windows Server / Linux VM
  ├─ IIS (Windows) or Kestrel (Linux)
  ├─ SQL Server instance
  └─ Reverse proxy (Nginx/Apache for Linux)
```

#### Frontend (Angular SPA)

**Recommended: Azure Static Web Apps**
```
Azure Static Web Apps
  ├─ Compiled Angular dist/ folder
  ├─ Global CDN distribution
  ├─ Free SSL certificate
  └─ GitHub Actions CI/CD integration
```

**Alternatives**:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages

#### Background Service (Data Collection)

**Option 1: Scheduled Task**
```
Windows Task Scheduler / Linux Cron
  └─ Run Console app daily at 6 AM
```

**Option 2: Azure Functions**
```
Azure Functions (Timer Trigger)
  └─ Serverless execution
```

**Option 3: Azure WebJob**
```
Azure WebJob (attached to App Service)
  └─ Scheduled or continuous
```

### CI/CD Pipeline

**GitHub Actions Workflow** (`.github/workflows/build-test-run.yml`):

```yaml
Jobs:
  1. build-and-test
     ├─ Restore NuGet packages
     ├─ Build solution
     ├─ Run unit tests
     └─ Check for warnings

  2. runtime-check
     ├─ Verify config files exist
     └─ Validate project structure

  3. code-quality
     ├─ Check nullable references
     └─ Enforce coding standards
```

**Benefits**:
- Catch errors before merging to main
- Automated testing on every commit
- Cross-platform validation (Linux runners)
- Prevents broken builds in production

## Extensibility Points

### 1. Adding New Economic Indicators

**Steps**:
1. Insert new row in `FredSeries` table (via migration)
2. Set `Enabled = true`
3. Run Console app
4. Automatically appears in dashboard

**No code changes required!**

### 2. Adding New Data Sources (e.g., World Bank API)

**Steps**:
1. Create `WorldBankApiRequester : RequestManager`
2. Implement `GetBaseUrl()` and `GetAuthenticationType()`
3. Create mapper for response format
4. (Optional) Create new entities if data structure differs
5. Update MainService to orchestrate

**Follows Open/Closed Principle**: Extend, don't modify

### 3. Custom Dashboard Widgets

**Steps**:
1. Create new Angular component
2. Inject `EconomicDataService`
3. Add to `dashboard.component.html`
4. (Optional) Add new API endpoint if custom aggregation needed

### 4. New Database Providers (e.g., PostgreSQL)

**Steps**:
1. Add NuGet package: `Npgsql.EntityFrameworkCore.PostgreSQL`
2. Update `ConfigurationHelper.ConfigureDbContextOptions`:
   ```csharp
   else if (connectionString.Contains("Host="))
   {
       optionsBuilder.UseNpgsql(connectionString);
   }
   ```
3. Test migrations on PostgreSQL
4. Update documentation

## Performance Considerations

### Database

**Indexing Strategy**:
- Index on `FredSeriesId` and `Date` for fast time-series queries
- Clustered index on `Id` (default)
- Consider columnstore index for large datasets (millions of rows)

**Query Optimization**:
- Use `.AsNoTracking()` for read-only queries (API)
- Lazy loading proxies for navigation properties
- Pagination for large result sets (future)

### API

**Caching** (future enhancement):
- Response caching for static series data
- Redis for distributed caching
- HTTP ETag support

**Compression**:
- Enable response compression middleware
- Reduces JSON payload size

### Frontend

**Bundle Optimization**:
- Lazy loading for routes (future)
- Tree-shaking removes unused code
- Production build minifies JavaScript

**Change Detection**:
- OnPush strategy for presentational components
- Reduces Angular change detection cycles

## Testing Strategy

### Current State
- No unit tests yet (future work)

### Recommended Approach

**Unit Tests** (xUnit):
- Repository methods
- Service logic
- Mapper transformations
- Controller actions

**Integration Tests**:
- API endpoint responses
- Database queries via repositories
- End-to-end data flow

**Frontend Tests** (Jasmine/Karma):
- Component logic
- Service HTTP calls (mocked)
- User interactions

**Example**:
```csharp
[Fact]
public async Task GetSeriesById_ReturnsCorrectSeries()
{
    // Arrange
    var mockRepo = new Mock<IFredSeriesRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(new FredSeries { Id = 1, Name = "GDP" });

    var controller = new SeriesController(mockUnitOfWork.Object);

    // Act
    var result = await controller.GetById(1);

    // Assert
    Assert.NotNull(result.Value);
    Assert.Equal("GDP", result.Value.Name);
}
```

## Conclusion

The Economic Data Tracker demonstrates a well-architected .NET application following industry best practices:

✅ **Clean Architecture** - Clear separation of concerns
✅ **SOLID Principles** - Maintainable and testable code
✅ **Design Patterns** - Repository, Unit of Work, Template Method, Factory
✅ **Modern Stack** - .NET 10, Angular 17, EF Core 10
✅ **Database Flexibility** - SQL Server for production, SQLite for development
✅ **CI/CD** - Automated build and quality checks
✅ **Extensibility** - Easy to add new indicators and data sources
✅ **Production-Ready** - Logging, error handling, deployment options

This architecture provides a solid foundation for tracking economic indicators and can easily scale to handle additional data sources, more complex visualizations, and higher traffic loads.
