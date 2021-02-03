//dto for product type
namespace TelemView.API.Dtos
{
    public class ProductTypeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Counter {get; set; }
        public int FilteredCounter { get; set; }
    }
}