using Microsoft.EntityFrameworkCore.Migrations;

namespace TelemView.API.Migrations
{
    public partial class hebrewYear : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeYearOfCreation",
                table: "Products",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeYearOfCreation",
                table: "Products");
        }
    }
}
