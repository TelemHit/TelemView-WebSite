namespace TelemView.API.Models
{
    public class Media
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public bool IsMain {get; set; }
    }
}