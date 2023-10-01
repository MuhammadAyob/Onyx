using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class CoursesController : ApiController
    {
        private readonly ICourses _courseRepo;

        public CoursesController(ICourses courseRepo)
        {
            this._courseRepo = courseRepo;
        }
       
        public static bool IsDouble(object value)
        {
            return value is double;
                 
        }

        [HttpGet]
        [Route("api/GetEmployeesForCourses")]
        public async Task<object> GetEmployeesForCourses()
        {
            return await _courseRepo.GetEmployeesForCourses();
        }


        [HttpPost]
        [Route("api/AddCourse")]
        public async Task<object> AddCourse(CourseDetails course)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }


                if (!IsDouble(course.Price))
                {
                    return new { Status = 401, Message = "Course Price incorrect" };
                }

                if (course.CategoryID == 0)
                {
                    return new { Status = 420, Message = "Please select a category" };
                }

                return await _courseRepo.AddCourse(course);
            }

            catch (Exception e)
            {
                return e.ToString();
            }
        }

        [HttpGet]
        [Route("api/GetCourseAssistants/{id}")]
        public async Task<object> GetCourseAssistants(int id)
        {
            return await _courseRepo.GetCourseAssistants(id);
        }

        [HttpGet]
        [Route("api/MaintainCourse/{id}")]
        public async Task<object> MaintainCourse(int id)
        {
            return await _courseRepo.MaintainCourse(id);
        }

        [HttpGet]
        [Route("api/GetCourseDetails")]
        public async Task<object> GetCourseDetails()
        {
            return await _courseRepo.GetCourseDetails();
        }

        [HttpPut]
        [Route("api/UpdateCourse/{id}")]
        public async Task<object> UpdateCourse(int id, CourseDetails course)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 401, Message = "Invalid data" };
                }

                return await _courseRepo.UpdateCourse(id, course);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteCourse/{id}")]
        public async Task<object> DeleteCourse(int id)
        {
            return await _courseRepo.DeleteCourse(id);
        }

        [HttpGet]
        [Route("api/GetCourseID/{id}")]
        public async Task<object> GetCourseID(int id)
        {
            return await _courseRepo.GetCourseID(id);
        }

        [HttpGet]
        [Route("api/GetCategory/{id}")]
        public async Task<object>GetCategory(int id)
        {
            return await _courseRepo.GetCategory(id);
        }

        [HttpGet]
        [Route("api/ViewStore/{studentID}")]
        public async Task<object>ViewStore(int studentID)
        {
            return await _courseRepo.ViewStore(studentID);
        }

        [HttpGet]
        [Route("api/GetAllStoreDetails/{studentID}")]
        public async Task<object> GetAllStoreDetails(int studentID)
        {
            return await _courseRepo.GetAllStoreDetails(studentID);
        }


        [HttpGet]
        [Route("api/ViewCourseStructure/{id}")]
        public async Task<object> ViewCourseStructure(int id)
        {
            return await _courseRepo.ViewCourseStructure(id);
        }

        [HttpGet]
        [Route("api/GetRatings/{id}")]
        public async Task<object> GetRatings(int id)
        {
            return await _courseRepo.GetRatings(id);
        }

        [HttpGet]
        [Route("api/GetPersonalRatings/{id}")]
        public async Task<object>GetPersonalRatings(int id)
        {
            return await _courseRepo.GetPersonalRatings(id);
        }

        [HttpPost]
        [Route("api/SendContactQuery")]
        public async Task <object> SendContactQuery(dynamic body)
        {
            return await _courseRepo.SendContactQuery(body);
        }

        [HttpPost]
        [Route("api/SendAnnouncement")]
        public async Task<object> SendAnnouncement(Announcement announcement)
        {
            return await _courseRepo.SendAnnouncement(announcement);
        }

        [HttpGet]
        [Route("api/GetCourseView/{id}")]
        public async Task<object> GetCourseView(int id)
        {
            return await _courseRepo.GetCourseView(id);
        }

        [HttpGet]
        [Route("api/GetEnrolledCourses/{id}")]
        public async Task<object> GetEnrolledCourses(int id)
        {
            return await _courseRepo.GetEnrolledCourses(id);
        }
    }
}
