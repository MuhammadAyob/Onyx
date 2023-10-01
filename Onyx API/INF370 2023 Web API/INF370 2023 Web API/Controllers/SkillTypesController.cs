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
    public class SkillTypesController : ApiController
    {
        private readonly ISkillTypes _skillTypesRepo;

        public SkillTypesController(ISkillTypes skillTypesRepo)
        {
            this._skillTypesRepo = skillTypesRepo;
        }

        [HttpGet]
        [Route("api/GetSkillTypes")]
        public async Task<object> GetSkillTypes()
        {
            return await _skillTypesRepo.GetSkillTypes();
        }

        [HttpGet]
        [Route("api/GetSkillTypeName/{id}")]
        public async Task<object> GetSkillTypeName(int id)
        {
            return await _skillTypesRepo.GetSkillTypeName(id);
        }

        [HttpGet]
        [Route("api/GetSkillType/{SkillTypeName}")]
        public async Task<object> GetSkillType(string SkillTypeName)
        {
            return await _skillTypesRepo.GetSkillType(SkillTypeName);
        }

        [HttpGet]
        [Route("api/ValidateSkillType/{id}")]
        public async Task<bool> ValidateSkillType(int id,SkillType skillType)
        {
            return await _skillTypesRepo.ValidateSkillType(id,skillType);
        }

        [HttpPut]
        [Route("api/UpdateSkillType/{id}")]
        public async Task<object> UpdateSkillType(int id, SkillType skillType)
        {
            try
            {
                return await _skillTypesRepo.UpdateSkillType(id, skillType);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPost]
        [Route("api/AddSkillType")]
        public async Task<object> AddSkillType([FromBody] SkillType skillType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }
                return await _skillTypesRepo.AddSkillType(skillType);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteSkillType/{id}")]
        public async Task<object> DeleteSkillType(int id)
        {
            try
            {
                return await _skillTypesRepo.DeleteSkillType(id);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

    }
}
