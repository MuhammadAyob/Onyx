using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IStoredProcedures
    {
        object GetMaintenance(int maintenanceId);
        object GetMaintenanceList();
        object RevenueReport(Revenue revenue);
        object GetSales(Revenue revenue);
        object GetSkillsWithTypes();
        object GetEmployeesWithSkills(int id);
        object GetDashboardData();
        object GetContacts(Revenue revenue);
        object GetCoursePerformanceReport(int id);
        object GetCourses();
    }
}
