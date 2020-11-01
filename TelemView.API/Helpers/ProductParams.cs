namespace TelemView.API.Helpers
{
    public class ProductParams
    {
        public int[] ProductType { get; set; }
        public int[] Organizations { get; set; }
        public int[] Courses { get; set; }
        public int[] Lecturers { get; set; }
        public int[] OrganizationTypes { get; set; }
        public int[] Tasks { get; set; }
        public int[] Years { get; set; }
        public string[] Degrees { get; set; }
        public string Search {get; set; }
    }
}