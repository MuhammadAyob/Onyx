using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;
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
    public class EmployeesController : ApiController
    {
        public readonly IEmployees _employeeRepo;

        public EmployeesController(IEmployees employeeRepo)
        {
            this._employeeRepo = employeeRepo;
        }

        [HttpGet]
        [Route("api/GetEmployees")]
        public async Task<object> GetEmployees()
        {
            try
            {
                return await _employeeRepo.GetEmployees();
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
        [Route("api/ViewEmployeeDetails/{id}")]
        public async Task<object> ViewEmployeeDetails(int id)
        {
            return await _employeeRepo.ViewEmployeeDetails(id);
        }

        [HttpPost]
        [Route("api/AddEmployee")]
        public async Task<object> AddEmployee([FromBody] EmployeeViewModel employee)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                if(employee.Employee.DepartmentID==0 || employee.Employee.UserRoleID==0 || employee.Employee.TitleID==0 )
                {
                    return new { Status = 600, Message = "One of the following dropdowns is not selected: Title, User Role or Department" };
                }

                return await _employeeRepo.AddEmployee(employee);
            }
            catch (Exception e)
            {
                //dynamic toReturn = new ExpandoObject();
                // toReturn.Status = 501;
                //toReturn.Message = "Internal Server, error please try again";
                // return toReturn;
                return e.ToString();
            }
        }

        [HttpGet]
        [Route("api/GetEmployeeDetails/{id}")]
        public async Task<object> GetEmployeeDetails(int id)
        {
            try 
            {
                return await _employeeRepo.GetEmployeeDetails(id);
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
        [Route("api/UpdateEmployee/{id}")]
        public async Task<object> UpdateEmployee(int id, EmployeeViewModel employee)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new
                    {
                        Status = 400,
                        Message = "Invalid data"
                    };
                }


               
                return await _employeeRepo.UpdateEmployee(id, employee);
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
        [Route("api/DeleteEmployee/{id}")]
        public async Task<object> DeleteEmployee(int id)
        {
            try 
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

               

                return await _employeeRepo.DeleteEmployee(id);
            }
            catch (Exception e)
            {
                // dynamic toReturn = new ExpandoObject();
                // toReturn.Status = 500;
                // toReturn.Message = "Internal server error, please try again";
                // return toReturn;
                return e.ToString();
            }
        }

        [HttpGet]
        [Route("api/GetEmployeeSkills/{id}")]
        public async Task<object> GetEmployeeSkills(int id)
        {
            try
            {
                return await _employeeRepo.GetEmployeeSkills(id);
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
        [Route("api/GetEmployeeQualifications/{id}")]
        public async Task<object> GetEmployeeQualifications(int id)
        {
            try 
            {
                return await _employeeRepo.GetEmployeeQualifications(id);
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
        [Route("api/GetEmployeeName/{id}")]
        public async Task<object> GetEmployeeName(int id)
        {
            try 
            {
                return await _employeeRepo.GetEmployeeName(id);

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
        [Route("api/GetEmployeeID/{id}")]
        public async Task<object> GetEmployeeID(int id)
        {
            return await _employeeRepo.GetEmployeeID(id);
        }

    }
}
