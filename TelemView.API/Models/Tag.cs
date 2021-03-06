using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public virtual ICollection<ProductTag> ProductsTags { get; set; }
    }
}