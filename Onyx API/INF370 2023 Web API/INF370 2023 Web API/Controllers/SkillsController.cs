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
    public class SkillsController : ApiController
    {
        private readonly ISkills _skillsRepo;

        public SkillsController(ISkills skillsRepo)
        {
            this._skillsRepo = skillsRepo;
        }

        [HttpGet]
        [Route("api/GetSkills")]
        public async Task<object> GetSkills()
        {
            return await _skillsRepo.GetSkills();
        }

        [HttpGet]
        [Route("api/GetSkillList")]
        public async Task<object> GetSkillList()
        {
            return await _skillsRepo.GetSkillList();
        }

       // [HttpGet]
       // [Route("api/GetSkillTypes")]
       // public async Task<object> GetSkillsTypes()
       // {
       //     return await _skillsRepo.GetSkillsTypes();
       // }

        [HttpGet]
        [Route("api/GetSkill/{name}")]
        public async Task<object> GetSkill(string name)
        {
            return await _skillsRepo.GetSkill(name);
        }

        [HttpPut]
        [Route("api/UpdateSkill/{id}")]
        public async Task<object> UpdateSkill(int id, Skill skill)
        {
            try
            {
                return await _skillsRepo.UpdateSkill(id, skill);
            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        [HttpPost]
        [Route("api/AddSkill")]
        public async Task<object> AddSkill([FromBody] Skill skill)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new{ Status = 404,Message = "Invalid data"};
                }

                return await _skillsRepo.AddSkill(skill);
            }

            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        [HttpDelete]
        [Route("api/DeleteSkill/{id}")]
        public async Task<object> DeleteSkill(int id)
        {
            return await _skillsRepo.DeleteSkill(id);
        }

        [HttpGet]
        [Route("api/GetSkillAssignedCheck/{id}")]
        public async Task<object> GetSkillAssignedCheck(int id)
        {
            return await _skillsRepo.GetSkillAssignedCheck(id);
        }
    }
}
