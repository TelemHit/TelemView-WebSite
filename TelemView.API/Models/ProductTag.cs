namespace TelemView.API.Models
{
    public class ProductTag
    {
    public int TagId { get; set; }
    public virtual Tag Tag { get; set; }

    public int ProductId { get; set; }
    public virtual Product Product { get; set; }
    }
}