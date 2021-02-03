//dto for Lecturer data
namespace TelemView.API.Dtos
{
    public class LecturersDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Counter {get; set; }
        public int FilteredCounter { get; set; }
    }
}