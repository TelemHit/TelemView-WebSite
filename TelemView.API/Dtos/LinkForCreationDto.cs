
using System;
using Microsoft.AspNetCore.Http;
//dto for new Link we create in database
namespace TelemView.API.Dtos
{
    public class LinkForCreationDto
    {
        public string MDescription { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
    }
}