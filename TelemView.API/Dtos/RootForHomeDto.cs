using System.Collections.Generic;

namespace TelemView.API.Dtos
{
    public class RootForHomeDto
    {
        public IEnumerable<ProductForHomeDto> Products { get; set; }
        public DataForHomeDto GeneralData { get; set; }
    }
}