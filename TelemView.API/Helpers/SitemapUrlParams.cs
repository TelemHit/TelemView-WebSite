using System;

namespace TelemView.API.Helpers
{
    public class SitemapUrlParams
    {
        public enum ChangeFrequency
        {
            Always,
            Hourly,
            Daily,
            Weekly,
            Monthly,
            Yearly,
            Never
        }

        public class SitemapUrl
        {
            public string Url { get; set; }
            public DateTime? Modified { get; set; }
            public ChangeFrequency? ChangeFrequency { get; set; }
            public double? Priority { get; set; }
        }
    }
}