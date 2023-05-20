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
    public class QualificationsController : ApiController
    {
        public readonly IQualifications _qualificationsRepo;

        public QualificationsController(IQualifications qualificationsRepo)
        {
            this._qualificationsRepo = qualificationsRepo;
        }

        [HttpGet]
        [Route("api/GetQualifications")]
        public async Task<object> GetQualifications()
        {
            return await _qualificationsRepo.GetQualifications();
        }

        [HttpPost]
        [Route("api/AddQualification")]
        public async Task<object> AddQualification([FromBody] Qualification qualification)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 403, Message = "Invalid data post" };
                }

                return await _qualificationsRepo.AddQualification(qualification);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateQualification/{id}")]
        public async Task<object> UpdateQualification(int id, Qualification qualification)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data post" };
                }

                return await _qualificationsRepo.UpdateQualification(id, qualification);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteQualification/{id}")]
        public async Task<object> DeleteQualification(int id)
        {
            try
            {
                return await _qualificationsRepo.DeleteQualification(id);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/ValidateQualification/{id}")]
        public async Task<bool> ValidateQualification(int id, Qualification qualification)
        {
            return await _qualificationsRepo.ValidateQualification(id, qualification);
        }

        [HttpGet]
        [Route("api/GetQualificationAssignedCheck/{id}")]
        public async Task<object> GetQualificationAssignedCheck(int id)
        {
            return await _qualificationsRepo.GetQualificationAssignedCheck(id);
        }

        [HttpGet]
        [Route("api/GetQualificationID/{id}")]
        public async Task<object> GetQualificationID(int id)
        {
            return await _qualificationsRepo.GetQualificationID(id);
        }

        [HttpGet]
        [Route("api/GetQualification/{QualificationName}")]
        public async Task<object> GetQualification(string QualificationName)
        {
            return await _qualificationsRepo.GetQualification(QualificationName);
        }
        //Final Commit


    }
}
