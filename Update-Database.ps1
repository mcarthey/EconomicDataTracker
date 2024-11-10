<#
.SYNOPSIS
    Updates the database to a specified migration or the latest migration for the specified context.

.DESCRIPTION
    This script simplifies the process of updating the database by taking only the context name and an optional migration name.
    If no migration name is provided, the database will be updated to the latest migration.

.PARAMETER ContextName
    The name of the DbContext to use for the database update. Acceptable values are:
    - "ApplicationContext"
    - "ConfigContext"

.PARAMETER MigrationName
    The name of the migration to update to. If omitted, the database will be updated to the latest migration.

.EXAMPLE
    .\Update-Database.ps1 -ContextName "ApplicationContext"
    Updates the database to the latest migration for the ApplicationContext DbContext.

.EXAMPLE
    .\Update-Database.ps1 -ContextName "ConfigContext" -MigrationName "InitialCreate"
    Updates the database to the "InitialCreate" migration for the ConfigContext DbContext.

#>

param (
    [string]$ContextName = "ApplicationContext",
    [string]$MigrationName = ""  # Optional migration name
)

# Define the project path based on the context
switch ($ContextName) {
    "ApplicationContext" {
        $projectPath = "EconomicDataTracker.Migrations"
    }
    "ConfigContext" {
        $projectPath = "EconomicDataTracker.Migrations"
    }
    default {
        Write-Host "Invalid context name. Please use 'ApplicationContext' or 'ConfigContext'."
        exit
    }
}

# Construct the base command for updating the database
$command = "dotnet ef database update --context $ContextName --project $projectPath"

# Append the migration name if provided
if ($MigrationName -ne "") {
    $command += " $MigrationName"
}

# Display and run the command
Write-Host "Running: $command"
Invoke-Expression $command
