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
    public class LessonsController : ApiController
    {
        private readonly ILessons _lessonRepo;

        public LessonsController(ILessons lessonRepo)
        {
            this._lessonRepo = lessonRepo;
        }

        [HttpGet]
        [Route("api/GetSectionLessons/{id}")]
        public async Task<object> GetSectionLessons(int id)
        {
            return await _lessonRepo.GetSectionLessons(id);
        }

        [HttpGet]
        [Route("api/MaintainLesson/{id}")]
        public async Task<object> MaintainLesson(int id)
        {
            return await _lessonRepo.MaintainLesson(id);
        }

        [HttpPost]
        [Route("api/AddLesson")]
        public async Task<object> AddLesson([FromBody] Lesson lesson)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _lessonRepo.AddLesson(lesson);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateLesson/{id}")]
        public async Task<object> UpdateLesson(int id, Lesson lesson)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _lessonRepo.UpdateLesson(id, lesson);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteLesson/{id}")]
        public async Task<object> DeleteLesson(int id)
        {
            return await _lessonRepo.DeleteLesson(id);
        }
    }
}
