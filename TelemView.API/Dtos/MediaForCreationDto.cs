using System;
using Microsoft.AspNetCore.Http;

namespace TelemView.API.Dtos
{
    public class MediaForCreationDto
    {
        public IFormFile File { get; set; }
    }
}