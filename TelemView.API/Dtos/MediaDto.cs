namespace TelemView.API.Dtos
{
    public class MediaDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string MDescription { get; set; }
        public bool IsMain {get; set; }
        public string Status { get; set; }
    }
}