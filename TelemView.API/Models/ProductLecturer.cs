namespace TelemView.API.Models
{
    public class ProductLecturer
    {
    public int LecturerId { get; set; }
    public Lecturer Lecturer { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }
    }
}