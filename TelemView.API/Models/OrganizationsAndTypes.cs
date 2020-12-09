namespace TelemView.API.Models
{
    public class OrganizationsAndTypes
    {
        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }

        public int OrganizationTypeId { get; set; }
        public OrganizationType OrganizationType { get; set; }
    }
}