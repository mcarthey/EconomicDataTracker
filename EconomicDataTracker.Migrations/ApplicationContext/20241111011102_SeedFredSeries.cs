using EconomicDataTracker.Common.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EconomicDataTracker.Migrations.ApplicationContext
{
    /// <inheritdoc />
    public partial class SeedFredSeries : BaseMigration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            RunSql(migrationBuilder);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            RunSqlRollback(migrationBuilder);
        }
    }
}
