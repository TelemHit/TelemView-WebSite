namespace TelemView.API.Models
{
    public class ProductCourse
    {
    public int CourseId { get; set; }
    public virtual Course Course { get; set; }

    public int ProductId { get; set; }
    public virtual Product Product { get; set; }
    }
}