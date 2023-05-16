using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IQualifications
    {
        Task<object> GetQualifications();

        Task<object> AddQualification([FromBody] Qualification qualification);

        Task<object> UpdateQualification(int id, Qualification qualification);

        Task<object> DeleteQualification(int id);

        Task<bool> ValidateQualification(int id, Qualification qualification);

        Task<object> GetQualificationAssignedCheck(int id);

        Task<object> GetQualificationID(int id);

        Task<object> GetQualification(string QualificationName);
    }
}
