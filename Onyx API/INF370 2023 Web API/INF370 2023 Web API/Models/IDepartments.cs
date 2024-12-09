using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IDepartments
    {
        Task<object> AddDepartment([FromBody] Department department);

        Task<object> UpdateDepartment(int id, Department department);
        
        Task<object> DeleteDepartment(int id);

        Task<object> GetDepartments();

        Task<object> GetDepartmentID(int id);

        Task<object> GetDepartment(string name);

        Task<bool> ValidateDepartment(int id, Department department);


    }
}
