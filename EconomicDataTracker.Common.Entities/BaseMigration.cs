using Microsoft.EntityFrameworkCore.Migrations;

namespace EconomicDataTracker.Common.Entities
{
    public abstract class BaseMigration : Migration
    {
        protected void RunSql(MigrationBuilder migrationBuilder)
        {
            // Get the name of the migration class
            string migrationName = GetType().Name;

            // Get the SQL script content, passing the context name
            string sql = MigrationHelper.GetMigrationScript(migrationName, "Up");

            // Execute the SQL script
            migrationBuilder.Sql(sql);
        }


        protected void RunSqlRollback(MigrationBuilder migrationBuilder)
        {
            // Get the name of the migration class
            string migrationName = GetType().Name;

            // Get the rollback SQL script content
            string sql = MigrationHelper.GetMigrationScript(migrationName, "Down");

            // Execute the SQL script
            migrationBuilder.Sql(sql);
        }
    }
}
