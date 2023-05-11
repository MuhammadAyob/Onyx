using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IEmployees
    {
        Task<object> GetEmployees();

        Task<object> GetEmployeeName(int id);

        Task<object> GetEmployeeDetails(int id);

        Task<object> UpdateEmployee(int id, EmployeeViewModel employee);

        Task<object> DeleteEmployee(int id);

        Task<object> GetEmployeeSkills(int id);

        Task<object> GetEmployeeQualifications(int id);

        Task<object> AddEmployee([FromBody] EmployeeViewModel employee);

        Task<object> GetEmployeeID(int id);
    }
}
