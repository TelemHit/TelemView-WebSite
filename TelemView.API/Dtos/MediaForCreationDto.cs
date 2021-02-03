
using Microsoft.AspNetCore.Http;
//dto for new media we create
namespace TelemView.API.Dtos
{
    public class MediaForCreationDto
    {
        public IFormFile File { get; set; }
    }
}