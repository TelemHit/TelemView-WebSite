using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TelemView.API.Data;
using TelemView.API.Models;

namespace TelemView.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            // creating scope to reach DataContext before running the host
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                //try to seed data
                try
                {
                    var context = services.GetRequiredService<DataContext>();
                    var roleManager = services.GetRequiredService<RoleManager<Role>>();
                    context.Database.Migrate();
                    Seed.SeedProducts(context, roleManager);
                }
                catch (Exception ex){
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
