using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using TelemView.API.Models;

namespace TelemView.API.Data
{
    public class Seed
    {
        public static void SeedProducts(DataContext context, RoleManager<Role> roleManager)
        {
            //check if tabels has any content. if not - seed from json
            if (!context.Products.Any())
            {
                var productData = System.IO.File.ReadAllText("Data/ProductSeedData.json");
                var products = JsonConvert.DeserializeObject<List<Product>>(productData);
                foreach (var product in products)
                {
                    context.Products.Add(product);
                }
                var roles = new List<Role>
                {
                    new Role{Name = "Admin"},
                    new Role{Name = "Editor"}
                };
            foreach (var role in roles)
            {
                roleManager.CreateAsync(role).Wait();
                
            }

                context.SaveChanges();
            }
        }
    }
}