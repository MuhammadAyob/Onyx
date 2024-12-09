using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ISkillTypes
    {
        Task<object> GetSkillTypes();

        Task<object> GetSkillTypeName(int id);

        Task<object> GetSkillType(string SkillTypeName);

        Task<bool> ValidateSkillType(int id,SkillType skillType);

        Task<object> UpdateSkillType(int id, SkillType skillType);

        Task<object> AddSkillType([FromBody] SkillType skillType);

        Task<object> DeleteSkillType(int id);
    }
}
