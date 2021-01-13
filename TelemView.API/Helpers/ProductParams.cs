namespace TelemView.API.Helpers
{
    public class ProductParams
    {
        public bool HideUnpublished { get; set; } = true;
        public int[] ProductTypes { get; set; }
        public int[] Organizations { get; set; }
        public int[] Courses { get; set; }
        public int[] Lecturers { get; set; }
        public int[] OrganizationTypes { get; set; }
        public int[] Tasks { get; set; }
        public int[] Years { get; set; }
        public string Degree { get; set; }
        public string Search {get; set; }
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 5;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
    }
}