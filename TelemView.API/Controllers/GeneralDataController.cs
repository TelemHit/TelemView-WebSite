using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Models;

//returns only general data - not product data
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralDataController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public GeneralDataController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetGeneralData()
        {
            var dataForHome = await _repo.GetGeneralData();
            var dataToReturn = _mapper.Map<DataForEditDto>(dataForHome);
            //return Ok(dataForHome);
            return Ok(dataToReturn);
        }
    }
}
