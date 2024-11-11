<#
.SYNOPSIS
    Adds a new Entity Framework migration for the specified context.

.DESCRIPTION
    This script simplifies the process of adding a new migration by taking only the context name and migration name as input.
    It sets the appropriate project path, output directory, and namespace based on the context.

.PARAMETER ContextName
    The name of the DbContext for which the migration is being added. Acceptable values are:
    - "ApplicationContext"
    - "ConfigContext"

.PARAMETER MigrationName
    The name of the migration to be created. This is a required parameter.

.EXAMPLE
    .\Add-Migration.ps1 -ContextName "ApplicationContext" -MigrationName "InitialCreate"
    Adds a migration named "InitialCreate" for the ApplicationContext DbContext.

.EXAMPLE
    .\Add-Migration.ps1 -ContextName "ConfigContext" -MigrationName "AddNewConfig"
    Adds a migration named "AddNewConfig" for the ConfigContext DbContext.

#>

param (
    [string]$ContextName = "ApplicationContext",
    [string]$MigrationName = "NewMigration"
)

# Define paths and namespaces based on the context
switch ($ContextName) {
    "ApplicationContext" {
        $projectPath = "EconomicDataTracker.Migrations"
        $outputDir = "ApplicationContext"
		$context = "ApplicationDbContext"
    }
    "ConfigContext" {
        $projectPath = "EconomicDataTracker.Migrations"
        $outputDir = "ConfigContext"
		$context = "ConfigDbContext"
    }
    default {
        Write-Host "Invalid context name. Please use 'ApplicationContext' or 'ConfigContext'."
        exit
    }
}

# Add migration
Write-Host "Adding migration '$MigrationName' for context '$ContextName'..."
$command = "dotnet ef migrations add $MigrationName --context $Context --project $projectPath --output-dir $outputDir"

# Display and run the command
Write-Host "Running: $command"
Invoke-Expression $command
