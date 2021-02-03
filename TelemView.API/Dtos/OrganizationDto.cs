
using System.Collections.Generic;
//dto for organization
namespace TelemView.API.Dtos
{
    public class OrganizationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Counter {get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes {get; set;}
        public int FilteredCounter { get; set; }
    }
}