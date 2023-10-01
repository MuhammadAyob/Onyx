using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ISkills
    {
        Task<object> GetSkills();

        Task<object> GetSkillList();

        Task<object> GetSkillsTypes();

        Task<object> GetSkill(string name);

        Task<object> UpdateSkill(int id, Skill skill);

        Task<object> AddSkill([FromBody] Skill skill);

        Task<object> DeleteSkill(int id);

        Task<object> GetSkillAssignedCheck(int id);
    }
}
