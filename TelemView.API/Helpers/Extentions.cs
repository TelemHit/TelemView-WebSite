using System.Collections.Generic;
using TelemView.API.Models;

namespace TelemView.API.Helpers
{
    public static class Extentions
    {
        public static int CalculateCounter(this ICollection<OrganizationsAndTypes> organizationsAndTypes)
        {
            int count = 0;
            foreach (var org in organizationsAndTypes)
            {
                count += org.Organization.Products.Count;
            }
                
            return count;
        }

        public static string CheckFileType(this string extention)
        {
            List<string> ImageExtensions = new List<string> { ".JPG", ".JPE", ".JPEG", ".GIF", ".PNG" };
            if(ImageExtensions.Contains(extention.ToUpperInvariant()))
            {
                return "image";
            }
            if(extention.ToUpperInvariant() == ".PDF"){
                return "file";
            }
        return "false";
        }

    }
}