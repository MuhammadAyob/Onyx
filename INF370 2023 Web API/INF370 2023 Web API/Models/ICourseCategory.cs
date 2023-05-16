using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ICourseCategory
    {
        Task<object> AddCategory([FromBody] CourseCategory courseCategory);

        Task<object> UpdateCategory(int id, CourseCategory courseCategory);

        Task<object> DeleteCategory(int id);

        Task<object> GetCategories();

        Task<object> GetCategoryID(int id);

        Task<object> GetCategory(string name);
    }
}
