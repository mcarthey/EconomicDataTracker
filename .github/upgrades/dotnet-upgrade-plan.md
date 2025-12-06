# .NET 10.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade EconomicDataTracker.Common.Entities\EconomicDataTracker.Common.Entities.csproj
4. Upgrade EconomicDataTracker.Common.Config\EconomicDataTracker.Common.Config.csproj
5. Upgrade EconomicDataTracker.Entities\EconomicDataTracker.Entities.csproj
6. Upgrade EconomicDataTracker.Common.Requests\EconomicDataTracker.Common.Requests.csproj
7. Upgrade EconomicDataTracker.Common.Logging\EconomicDataTracker.Common.Logging.csproj
8. Upgrade EconomicDataTracker.Api\EconomicDataTracker.Api.csproj
9. Upgrade EconomicDataTracker.Migrations\EconomicDataTracker.Migrations.csproj
10. Upgrade EconomicDataTracker.Tests\EconomicDataTracker.UnitTests.csproj
11. Upgrade EconomicDataTracker.Console\EconomicDataTracker.Console.csproj


## Settings

This section contains settings and data used by execution steps.

### Excluded projects

Table below contains projects that do belong to the dependency graph for selected projects and should not be included in the upgrade.

| Project name                                   | Description                 |
|:-----------------------------------------------|:---------------------------:|


### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                                   | Current Version | New Version | Description                                   |
|:-----------------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Microsoft.EntityFrameworkCore                   | 9.0.11          | 10.0.0      | Recommended to update for .NET 10 compatibility |
| Microsoft.EntityFrameworkCore.Design            | 8.0.10          | 10.0.0      | Recommended to update for .NET 10 compatibility |
| Microsoft.EntityFrameworkCore.Proxies           | 9.0.11          | 10.0.0      | Recommended to update for .NET 10 compatibility |
| Microsoft.EntityFrameworkCore.SqlServer         | 9.0.11          | 10.0.0      | Recommended to update for .NET 10 compatibility |


### Project upgrade details
This section contains details about each project upgrade and modifications that need to be done in the project.

#### EconomicDataTracker.Common.Entities modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.Proxies should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.SqlServer should be updated from `9.0.11` to `10.0.0`

Other changes:
  - Verify code compiles and update any API-breaking changes related to EF Core 10 where necessary.

#### EconomicDataTracker.Common.Config modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.Proxies should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.SqlServer should be updated from `9.0.11` to `10.0.0`

Other changes:
  - Verify code compiles and update any API-breaking changes related to EF Core 10 where necessary.

#### EconomicDataTracker.Entities modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.Design should be updated from `8.0.10` to `10.0.0`
  - Microsoft.EntityFrameworkCore.Proxies should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.SqlServer should be updated from `9.0.11` to `10.0.0`

Other changes:
  - Verify code compiles and update any API-breaking changes related to EF Core 10 where necessary.

#### EconomicDataTracker.Common.Requests modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

Other changes:
  - No NuGet package changes were identified for this project by analysis.

#### EconomicDataTracker.Common.Logging modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

Other changes:
  - No NuGet package changes were identified for this project by analysis.

#### EconomicDataTracker.Api modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore.Design should be updated from `8.0.10` to `10.0.0`
  - Microsoft.EntityFrameworkCore.Proxies should be updated from `9.0.11` to `10.0.0`
  - Microsoft.EntityFrameworkCore.SqlServer should be updated from `9.0.11` to `10.0.0`

Other changes:
  - Verify code compiles and update any API-breaking changes related to EF Core 10 where necessary.

#### EconomicDataTracker.Migrations modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore.Design should be updated from `8.0.10` to `10.0.0`

Other changes:
  - Verify EF Core tools compatibility and update migration tooling invocation if necessary.

#### EconomicDataTracker.Tests modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

Other changes:
  - Run and fix unit tests after framework and package updates.

#### EconomicDataTracker.Console modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

Other changes:
  - Verify code compiles and update any API-breaking changes related to EF Core 10 where necessary.
