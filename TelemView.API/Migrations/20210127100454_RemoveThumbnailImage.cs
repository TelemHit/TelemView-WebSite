using Microsoft.EntityFrameworkCore.Migrations;

namespace TelemView.API.Migrations
{
    public partial class RemoveThumbnailImage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Products");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
