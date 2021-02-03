using System.Collections.Generic;

//dto combine data for home - product and general data
namespace TelemView.API.Dtos
{
    public class RootForHomeDto
    {
        public IEnumerable<ProductForHomeDto> Products { get; set; }
        public DataForHomeDto GeneralData { get; set; }
    }
}