using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class OrganizationType
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public virtual ICollection<OrganizationsAndTypes> OrganizationAndType { get; set; }
    }
}