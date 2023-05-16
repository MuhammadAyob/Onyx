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
    public class CourseCategoryController : ApiController
    {
        private readonly ICourseCategory _courseCategoryRepo;

        public CourseCategoryController(ICourseCategory courseCategoryRepo)
        {
            this._courseCategoryRepo = courseCategoryRepo;
        }

        [HttpPost]
        [Route("api/AddCategory")]
        public async Task<object> AddCategory([FromBody] CourseCategory courseCategory)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _courseCategoryRepo.AddCategory(courseCategory);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateCategory/{id}")]
        public async Task<object> UpdateCategory(int id, CourseCategory courseCategory)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _courseCategoryRepo.UpdateCategory(id, courseCategory);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteCategory/{id}")]
        public async Task<object> DeleteCategory(int id)
        {
            return await _courseCategoryRepo.DeleteCategory(id);
        }

        [HttpGet]
        [Route("api/GetCategories")]
        public async Task<object> GetCategories()
        {
            return await _courseCategoryRepo.GetCategories();
        }

        [HttpGet]
        [Route("api/GetCategoryID/{id}")]
        public async Task<object> GetCategoryID(int id)
        {
            return await _courseCategoryRepo.GetCategoryID(id);
        }

      //  [HttpGet]
       // [Route("api/GetCategory/{name}")]
       // public async Task<object> GetCategory(string name)
       // {
       //     return await _courseCategoryRepo.GetCategory(name);
       // }

    }
}
