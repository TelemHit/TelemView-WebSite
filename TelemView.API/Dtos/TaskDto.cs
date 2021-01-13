namespace TelemView.API.Dtos
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Counter {get; set; }
        public int FilteredCounter { get; set; }
    }
}