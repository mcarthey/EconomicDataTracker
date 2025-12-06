using EconomicDataTracker.Common.Entities.Helpers;
using EconomicDataTracker.Entities.Data;
using EconomicDataTracker.Entities.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var environment = builder.Environment.EnvironmentName;
var config = ConfigurationHelper.GetConfiguration(environment);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Economic Data Tracker API",
        Version = "v1",
        Description = "API for tracking and visualizing key economic indicators from the Federal Reserve Economic Data (FRED)"
    });
});

// Configure database context
var connectionString = config.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)
           .UseLazyLoadingProxies());

// Register repositories and Unit of Work
builder.Services.AddScoped<IFredSeriesRepository, FredSeriesRepository>();
builder.Services.AddScoped<IFredObservationRepository, FredObservationRepository>();
builder.Services.AddScoped<IFredObservationUpdateTrackerRepository, FredObservationUpdateTrackerRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Configure CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",  // Angular default dev server
                "http://localhost:4201",
                "https://localhost:4200",
                "https://localhost:4201"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    // For production, add a more restrictive policy
    options.AddPolicy("Production", policy =>
    {
        // Update this with your production domain when deploying
        policy.WithOrigins("https://yourdomain.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add logging
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Economic Data Tracker API v1");
        options.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
    app.UseCors("AllowAngularApp");
}
else
{
    app.UseCors("Production");
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
