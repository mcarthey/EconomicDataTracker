#nullable disable

using EconomicDataTracker.Common.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EconomicDataTracker.Migrations.Migrations.ApplicationContext
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
