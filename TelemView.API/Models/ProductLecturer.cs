namespace TelemView.API.Models
{
    public class ProductLecturer
    {
    public int LecturerId { get; set; }
    public virtual Lecturer Lecturer { get; set; }

    public int ProductId { get; set; }
    public virtual Product Product { get; set; }
    }
}