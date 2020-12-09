using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Organization
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<OrganizationsAndTypes> OrganizationAndType { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}