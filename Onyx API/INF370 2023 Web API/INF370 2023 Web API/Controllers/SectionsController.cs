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
    public class SectionsController : ApiController
    {
        private readonly ISections _sectionsRepo;

        public SectionsController(ISections sectionsRepo)
        {
            this._sectionsRepo = sectionsRepo;
        }

        [HttpGet]
        [Route("api/GetCourseSections/{id}")]
        public async Task<object> GetCourseSections(int id)
        {
            return await _sectionsRepo.GetCourseSections(id);
        }

        [HttpGet]
        [Route("api/MaintainSection/{id}")]
        public async Task<object> MaintainSection(int id)
        {
            return await _sectionsRepo.MaintainSection(id);
        }

        [HttpPut]
        [Route("api/UpdateSection/{id}")]
        public async Task<object> UpdateSection(int id, Section section)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _sectionsRepo.UpdateSection(id, section);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPost]
        [Route("api/AddSection")]
        public async Task<object> AddSection([FromBody] Section section)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _sectionsRepo.AddSection(section);
            }

            catch (Exception e)
            {
                //  return new { Status = 500, Message = "Internal server error, please try again" };
                return e.ToString();
            }
        }

        [HttpDelete]
        [Route("api/DeleteSection/{id}")]
        public async Task<object> DeleteSection(int id)
        {
            return await _sectionsRepo.DeleteSection(id);
        }
    }
}
