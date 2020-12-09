using System.Collections.Generic;

namespace TelemView.API.Dtos
{
    public class OrganizationForUpdate
    {
        public string Title { get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
    }
}
