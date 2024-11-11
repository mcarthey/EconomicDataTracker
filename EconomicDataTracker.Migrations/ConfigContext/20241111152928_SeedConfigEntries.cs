using EconomicDataTracker.Common.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EconomicDataTracker.Migrations.ConfigContext
{
    /// <inheritdoc />
    public partial class SeedConfigEntries : BaseMigration
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
