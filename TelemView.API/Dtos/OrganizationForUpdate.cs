using System.Collections.Generic;
//dto for organization we update in db
namespace TelemView.API.Dtos
{
    public class OrganizationForUpdate
    {
        public string Title { get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
    }
}
