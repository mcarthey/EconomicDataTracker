﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EconomicDataTracker.Migrations.ApplicationContext
{
    /// <inheritdoc />
    public partial class AddObservationTrackingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FredObservationUpdateTrackers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FredSeriesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FredObservationUpdateTrackers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FredObservationUpdateTrackers_FredSeries_FredSeriesId",
                        column: x => x.FredSeriesId,
                        principalTable: "FredSeries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FredObservationUpdateTrackers_FredSeriesId",
                table: "FredObservationUpdateTrackers",
                column: "FredSeriesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FredObservationUpdateTrackers");
        }
    }
}