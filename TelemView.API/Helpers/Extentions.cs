using System.Collections.Generic;
using TelemView.API.Models;

namespace TelemView.API.Helpers
{
    public static class Extentions
    {
        public static int CalculateCounter(this ICollection<Organization> organizations)
        {
            int count = 0;
            foreach (var org in organizations)
            {
                count += org.Products.Count;
            }
                
            return count;
        }
    }
}