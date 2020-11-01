namespace TelemView.API.Models
{
    public class ProductStudent
    {
    public int StudentId { get; set; }
    public Student Student { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }
    }
}