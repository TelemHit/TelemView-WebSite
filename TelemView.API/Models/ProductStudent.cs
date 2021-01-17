namespace TelemView.API.Models
{
    public class ProductStudent
    {
    public int StudentId { get; set; }
    public virtual Student Student { get; set; }

    public int ProductId { get; set; }
    public virtual Product Product { get; set; }
    }
}