using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ILessonResource
    {
        Task<object> GetLessonsResources(int id);

        Task<object> MaintainLessonResource(int id);

        Task<object> AddLessonResource([FromBody] LessonResource lessonResource);

        Task<object> UpdateLessonResource(int id, LessonResource lessonResource);

        Task<object> DeleteLessonResource(int id);

        Task<object> MaintainResource(int id);
    }
}
