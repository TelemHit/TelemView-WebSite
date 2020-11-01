using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class ProductType
    {
        public int Id { get; set; }
        public string Title { get; set; }
         public ICollection<Product> Products { get; set; }
    }
}