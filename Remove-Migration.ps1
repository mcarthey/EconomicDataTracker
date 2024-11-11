<#
.SYNOPSIS
    Removes the last Entity Framework migration for the specified context.

.DESCRIPTION
    This script simplifies the process of removing the last migration by taking only the context name as input.
    It sets the appropriate project path based on the context.

.PARAMETER ContextName
    The name of the DbContext for which the last migration should be removed. Acceptable values are:
    - "ApplicationContext"
    - "ConfigContext"

.EXAMPLE
    .\Remove-Migration.ps1 -ContextName "ApplicationContext"
    Removes the last migration for the ApplicationContext DbContext.

.EXAMPLE
    .\Remove-Migration.ps1 -ContextName "ConfigContext"
    Removes the last migration for the ConfigContext DbContext.

#>

param (
    [string]$ContextName = "ApplicationContext"
)

# Define the project path based on the context
switch ($ContextName) {
    "ApplicationContext" {
        $projectPath = "EconomicDataTracker.Migrations"
		$context = "ApplicationDbContext"
    }
    "ConfigContext" {
        $projectPath = "EconomicDataTracker.Migrations"
		$context = "ConfigDbContext"
    }
    default {
        Write-Host "Invalid context name. Please use 'ApplicationContext' or 'ConfigContext'."
        exit
    }
}

# Remove the last migration
Write-Host "Removing the last migration for context '$ContextName'..."
$command = "dotnet ef migrations remove  --context $Context --project $projectPath"

# Display and run the command
Write-Host "Running: $command"
Invoke-Expression $command
