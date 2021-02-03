using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

//define the main folder and html file of the project
//called in Startup.cs file
namespace TelemView.API.Controllers
{
    [AllowAnonymous]
    public class Fallback: Controller
    {
        public IActionResult Index(){
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", 
            "index.html"), "text/HTML");
        }
    }
}