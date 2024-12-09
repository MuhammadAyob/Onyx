using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ILessons
    {
        Task<object> GetSectionLessons(int id);

        Task<object> MaintainLesson(int id);

        Task<object> AddLesson([FromBody] Lesson lesson);

        Task<object> UpdateLesson(int id, Lesson lesson);

        Task<object> DeleteLesson(int id);
    }
}
