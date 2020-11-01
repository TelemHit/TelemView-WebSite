using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;

namespace TelemView.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public HomeController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForHome()
        {
            var dataForHome = await _repo.GetDataForHome();
            var dataToReturn = _mapper.Map<DataForHomeDto>(dataForHome);
            //return Ok(dataForHome);
            return Ok(dataToReturn);
        }
    }
}