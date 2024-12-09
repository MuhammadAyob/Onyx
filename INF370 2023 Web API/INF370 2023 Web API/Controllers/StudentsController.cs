using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class StudentsController : ApiController
    {
        public readonly IStudents _studentRepo;

        public StudentsController(IStudents studentRepo)
        {
            this._studentRepo = studentRepo;
        }

        [HttpGet]
        [Route("api/GetStudents")]
        public async Task<object> GetStudents()
        {
            try
            {
                return await _studentRepo.GetStudents();
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/GetStudentName/{id}")]
        public async Task<object> GetStudentName(int id)
        {
            try
            {
                return await _studentRepo.GetStudentName(id);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/GetStudentID/{id}")]
        public async Task<object>GetStudentID(int id)
        {
            return await _studentRepo.GetStudentID(id);
        }

        [HttpPut]
        [Route("api/UpdateStudent/{id}")]
        public async Task<object> UpdateStudent(int id, Student student)
        {
            try
            {
                return await _studentRepo.UpdateStudent(id, student);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        [HttpPut]
        [Route("api/DeleteStudent/{id}")]
        public async Task<object> DeleteStudent(int id, Student student)
        {
            try
            {
                return await _studentRepo.DeleteStudent(id, student);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }
    }


}
