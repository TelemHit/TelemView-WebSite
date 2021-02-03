using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TelemView.API.Models;

//collection of helper functions.
namespace TelemView.API.Helpers
{
    public static class Extentions
    {
        //add errors to http headers
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        //calculate counter for organization type
        public static int CalculateCounter(this ICollection<OrganizationsAndTypes> organizationsAndTypes)
        {
            int count = 0;
            foreach (var org in organizationsAndTypes)
            {
                count += org.Organization.Products.Count;
            }

            return count;
        }

        //check the file type and if it is a valid type
        public static string CheckFileType(this string extention)
        {
            List<string> ImageExtensions = new List<string> { ".JPG", ".JPE", ".JPEG", ".GIF", ".PNG" };
            if (ImageExtensions.Contains(extention.ToUpperInvariant()))
            {
                return "image";
            }
            if (extention.ToUpperInvariant() == ".PDF")
            {
                return "file";
            }
            return "false";
        }

        //add pagination params to http headers
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var camelCaseFormater = new JsonSerializerSettings();
            camelCaseFormater.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",
                JsonConvert.SerializeObject(paginationHeader, camelCaseFormater));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}