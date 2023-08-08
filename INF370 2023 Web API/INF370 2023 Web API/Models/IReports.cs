using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IReports
    {
        Task<object> CourseTrendReport();
        Task<object> GetCourses();
        Task<object> CoursePerformance(int id);
        Task<object> RevenueReport(Revenue revenue);
        Task<object> MaintenanceReport(Revenue revenue);
        Task<object> GetSkillsWithTypes();
        Task<object> GetEmployeesWithSkill(int id);
        Task<object> GetContacts(Revenue revenue);
        Task<object> GetSales(Revenue revenue);
    }
}
