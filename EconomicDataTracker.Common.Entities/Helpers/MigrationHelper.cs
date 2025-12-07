using System.Diagnostics;
using System.Reflection;
using EconomicDataTracker.Common.Entities;

public static class MigrationHelper
{
    public static string GetMigrationScript(string migrationClassName, string scriptType)
    {
        // scriptType: "Up" or "Down"

        // Build the script file name
        string scriptFileName = scriptType == "Up"
            ? $"{migrationClassName}.sql"
            : $"{migrationClassName}.rollback.sql";

        // Get the directory of the executing assembly
        string? assemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (string.IsNullOrEmpty(assemblyLocation))
        {
            throw new InvalidOperationException("Could not determine assembly location");
        }

        // Dynamically retrieve the context name based on the DbContext type
        string contextName = GetContextName();

        // Build the path to the SQL script, including the contextName in the path
        string scriptPath = Path.Combine(assemblyLocation, contextName, "Scripts", scriptFileName);

        // Check if the file exists
        if (!File.Exists(scriptPath))
        {
            throw new FileNotFoundException($"SQL script file not found: {scriptPath}");
        }

        // Read and return the SQL script content
        return File.ReadAllText(scriptPath);
    }

    private static string GetContextName()
    {
        // Traverse the stack trace to find the actual migration subclass (not BaseMigration)
        var migrationClass = new StackTrace().GetFrames()
            .Select(frame => frame.GetMethod()?.DeclaringType)
            .FirstOrDefault(type => type != null && type.IsSubclassOf(typeof(BaseMigration)) && type != typeof(BaseMigration));

        if (migrationClass == null)
        {
            throw new InvalidOperationException("Could not determine the migration class in the stack trace.");
        }

        // Assuming the context name is part of the namespace (e.g., EconomicDataTracker.Migrations.ApplicationContext)
        var namespaceParts = migrationClass.Namespace?.Split('.');
        if (namespaceParts != null && namespaceParts.Length > 2)
        {
            // Typically, the third part might represent the context name, adjust based on your structure
            return namespaceParts[2]; // Adjusted this index based on your naming conventions
        }

        throw new InvalidOperationException("Could not determine the DbContext from the migration class namespace.");
    }

}
