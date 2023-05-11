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
    public class DepartmentsController : ApiController
    {
        private readonly IDepartments _departmentsRepo;
        
        public DepartmentsController(IDepartments departmentsRepo)
        {
            this._departmentsRepo = departmentsRepo;
        }

        [HttpPost]
        [Route("api/AddDepartment")]
        public async Task<object> AddDepartment([FromBody] Department department)
        {
            try 
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _departmentsRepo.AddDepartment(department);
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpPut]
        [Route("api/UpdateDepartment/{id}")]
        public async Task<object> UpdateDepartment(int id, Department department)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _departmentsRepo.UpdateDepartment(id, department);
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpDelete]
        [Route("api/DeleteDepartment/{id}")]
        public async Task<object> DeleteDepartment(int id)
        {
            try
            {
                return await _departmentsRepo.DeleteDepartment(id);
            }

            catch(Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpPut]
        [Route("api/ValidateDepartment/{id}")]
        public async Task<bool> ValidateDepartment(int id, Department department)
        {
             return await _departmentsRepo.ValidateDepartment(id, department);
            
        }

        [HttpGet]
        [Route("api/GetDepartment/{DepartmentName}")]
        public async Task<object> GetDepartment(string name)
        {
            try
            {
                return await _departmentsRepo.GetDepartment(name);
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/GetDepartmentID/{id}")]
        public async Task<object> GetDepartmentID(int id)
        {
            try
            {
                return await _departmentsRepo.GetDepartmentID(id);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/GetDepartments")]
        public async Task<object> GetDepartments()
        {
            try
            {
                return await _departmentsRepo.GetDepartments();
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
           
        }

    }
}
