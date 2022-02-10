using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Models;
using TelemView.API.Helpers;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

//this controller responsible for Media table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/editor/product/{productId}/media")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public MediaController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //add media for specific product
        [HttpPost]
        public async Task<IActionResult> AddMediaForProduct(int productId, [FromForm] MediaForCreationDto mediaForCreationDto)
        {
            var productFromRepo = await _repo.GetProduct(productId);
            var file = mediaForCreationDto.File;
            var newMedia = _mapper.Map<Media>(mediaForCreationDto);

            if (file.Length > 0)
            {
                //check file type with function in Extentions.cs file
                if (Extentions.CheckFileType(Path.GetExtension(mediaForCreationDto.File.FileName)) != "false")
                {
                    //generate file name
                    var fileName = productId + "_" + $@"{Guid.NewGuid()}" + Path.GetExtension(mediaForCreationDto.File.FileName).ToString();
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\images", fileName);

                    //save file in folder
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await mediaForCreationDto.File.CopyToAsync(fileStream);
                    }

                    //check file type
                    var type = Extentions.CheckFileType(Path.GetExtension(mediaForCreationDto.File.FileName));

                    newMedia.Url = fileName;
                    newMedia.Type = type;
                    newMedia.Description = mediaForCreationDto.File.FileName;
                    newMedia.Status = "Temp";

                    //add file to table
                    productFromRepo.Media.Add(newMedia);
                }
                else
                {
                    return BadRequest("not a valid file");
                }

            }

            if (await _repo.SaveAll())
            {
                var mediaToReturn = _mapper.Map<MediaForReturnDto>(newMedia);
                return CreatedAtRoute("GetMedia"
                , new { productId = productId, id = newMedia.Id }
                , mediaToReturn);
            }
            return BadRequest("could not add the photo");
        }

        //add link to url or youtube
        [HttpPost("link")]
        public async Task<IActionResult> AddLinksForProduct(int productId, LinkForCreationDto linkForCreationDto)
        {
            var productFromRepo = await _repo.GetProduct(productId);
            var url = linkForCreationDto.Url;
            if (url.Length > 0)
            {
                //link to youtube - generate embed link
                if (linkForCreationDto.Type == "video")
                {
                    var YoutubeVideoRegex = new Regex(@"youtu(?:\.be|be\.com)/(?:.*v(?:/|=)|(?:.*/)?)([a-zA-Z0-9-_]+)");
                    var VimeoVideoRegex = new Regex(@"vimeo\.com/(?:.*#|.*/)?([0-9]+)");

                    Match youtubeMatch = YoutubeVideoRegex.Match(url);
                    Match vimeoMatch = VimeoVideoRegex.Match(url);

                    if (youtubeMatch.Success)
                    {
                        linkForCreationDto.Url = "https://www.youtube.com/embed/" + youtubeMatch.Groups[1].Value;
                    }
                    else if (vimeoMatch.Success)
                    {
                        linkForCreationDto.Url ="https://player.vimeo.com/video/" + vimeoMatch.Groups[1].Value;
                    }
                    else
                    {
                        return BadRequest("not a video");
                    }
                }

                //url - make sure url is valid
                if (linkForCreationDto.Type == "link")
                {
                    bool isValidUrl = Uri.IsWellFormedUriString(url, UriKind.Absolute);
                    if (isValidUrl)
                    {
                        linkForCreationDto.Url = url;
                    }
                    else
                    {
                        return BadRequest("not a valid url");
                    }
                }

                linkForCreationDto.Status = "Temp";
                var newMedia = _mapper.Map<Media>(linkForCreationDto);
                productFromRepo.Media.Add(newMedia);
                if (await _repo.SaveAll())
                {
                    var linkToReturn = _mapper.Map<MediaForReturnDto>(newMedia);
                    return CreatedAtRoute("GetMedia"
                    , new { productId = productId, id = newMedia.Id }
                    , linkToReturn);
                }
                return BadRequest("could not add the link");
            }
            return BadRequest("not a link");
        }

        //get existing media
        [HttpGet("{id}", Name = "GetMedia")]
        public async Task<IActionResult> GetMedia(int id)
        {
            var mediaFromRepo = await _repo.GetMedia(id);

            var media = _mapper.Map<MediaForReturnDto>(mediaFromRepo);

            return Ok(media);
        }

        //delete media
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedia(int productId, int id)
        {
            var product = await _repo.GetProduct(productId);
            if (!product.Media.Any(m => m.Id == id))
                return Unauthorized();

            var mediaFromRepo = await _repo.GetMedia(id);

            if (mediaFromRepo.IsMain)
                return BadRequest("You can not delete your main photo");

            if (mediaFromRepo.Url != null)
            {
                if (mediaFromRepo.Type != "video" && mediaFromRepo.Type != "link")
                {
                    var fileName = mediaFromRepo.Url;
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\images", fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }

            _repo.Delete(mediaFromRepo);
            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the media");

        }

    }
}
