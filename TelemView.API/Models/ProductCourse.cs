namespace TelemView.API.Models
{
    public class ProductCourse
    {
    public int CourseId { get; set; }
    public Course Course { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }
    }
}