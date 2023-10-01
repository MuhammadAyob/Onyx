using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class InstructionalVideosController : ApiController
    {
        private readonly IInstructionalVideos _videoRepo;

        public InstructionalVideosController(IInstructionalVideos videoRepo)
        {
            this._videoRepo = videoRepo;
        }

        [HttpGet]
        [Route("api/GetInstructionalVideos")]
        public async Task<object> GetInstructionalVideos()
        {
            return await _videoRepo.GetInstructionalVideos();
        }

        [HttpGet]
        [Route("api/GetInstructionalVideosDetails")]
        public async Task<object> GetInstructionalVideosDetails()
        {
            return await _videoRepo.GetInstructionalVideosDetails();
        }

        [HttpPost]
        [Route("api/AddInstructionalVideo")]
        public async Task<object> AddInstructionalVideo([FromBody] InstructionalVideo instructionalVideo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data post" };
                }

                return await _videoRepo.AddInstructionalVideo(instructionalVideo);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateInstructionalVideo/{id}")]
        public async Task<object> UpdateInstructionalVideo(int id, InstructionalVideo instructionalVideo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data post" };
                }

                return await _videoRepo.UpdateInstructionalVideo(id, instructionalVideo);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteInstructionalVideo/{id}")]
        public async Task<object> DeleteInstructionalVideo(int id)
        {
            return await _videoRepo.DeleteInstructionalVideo(id);
        }

        [HttpGet]
        [Route("api/GetVideoName/{id}")]
        public async Task<object> GetVideoName(string name)
        {
            return await _videoRepo.GetVideoName(name);
        }

        [HttpGet]
        [Route("api/GetInstructionalVideo/{id}")]
        public async Task<object> GetInstructionalVideo(int id)
        {
            return await _videoRepo.GetInstructionalVideo(id);
        }



    }
}
