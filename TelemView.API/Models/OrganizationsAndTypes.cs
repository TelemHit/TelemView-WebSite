namespace TelemView.API.Models
{
    public class OrganizationsAndTypes
    {
        public int OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }

        public int OrganizationTypeId { get; set; }
        public virtual OrganizationType OrganizationType { get; set; }
    }
}