namespace TelemView.API.Dtos
{
    public class MediaDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public bool IsMain {get; set; }
    }
}