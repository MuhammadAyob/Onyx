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
    public class LessonResourcesController : ApiController
    {
        private readonly ILessonResource _lessonResourceRepo;

        public LessonResourcesController(ILessonResource lessonResourceRepo)
        {
            this._lessonResourceRepo = lessonResourceRepo;
        }

        [HttpGet]
        [Route("api/GetLessonsResources/{id}")]
        public async Task<object> GetLessonsResources(int id)
        {
            return await _lessonResourceRepo.GetLessonsResources(id);
        }

        [HttpGet]
        [Route("api/MaintainLessonResource/{id}")]
        public async Task<object> MaintainLessonResource(int id)
        {
            return await _lessonResourceRepo.MaintainLessonResource(id);
        }

        [HttpPost]
        [Route("api/AddLessonResource")]
        public async Task<object> AddLessonResource([FromBody] LessonResource lessonResource)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _lessonResourceRepo.AddLessonResource(lessonResource);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateLessonResource/{id}")]
        public async Task<object> UpdateLessonResource(int id, LessonResource lessonResource)
        {
            try 
            {
                //if (!ModelState.IsValid)
               // {
               //     return new { Status = 400, Message = "Invalid data" };
               // }

                return await _lessonResourceRepo.UpdateLessonResource(id, lessonResource);
            }
            catch (Exception e)
            {
                //return new { Status = 500, Message = "Internal server error, please try again" };
                return e.ToString();
            }
        }

        [HttpDelete]
        [Route("api/DeleteLessonResource/{id}")]
        public async Task<object> DeleteLessonResource(int id)
        {
            return await _lessonResourceRepo.DeleteLessonResource(id);
        }
    }
}
