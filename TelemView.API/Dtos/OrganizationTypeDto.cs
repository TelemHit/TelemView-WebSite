//dto for OrganizationType
namespace TelemView.API.Dtos
{
    public class OrganizationTypeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Counter {get; set; }
        public int FilteredCounter { get; set; }
    }
}