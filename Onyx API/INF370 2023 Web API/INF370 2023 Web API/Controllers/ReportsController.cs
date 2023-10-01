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
    public class ReportsController : ApiController
    {
        private readonly IReports _reportRepo;

        public ReportsController(IReports reportRepo)
        {
            this._reportRepo = reportRepo;
        }

        [HttpGet]
        [Route("api/TrendReport")]
        public async Task<object> TrendReport()
        {
            return await _reportRepo.CourseTrendReport();
        }

       [HttpGet]
       [Route("api/GetReportCourses")]
       public async Task<object> GetReportCourses()
       {
            return await _reportRepo.GetCourses();
       }

        [HttpGet]
        [Route("api/CoursePerformance/{id}")]
        public async Task<object> CoursePerformance(int id)
        {
            return await _reportRepo.CoursePerformance(id);
        }

        [HttpPost]
        [Route("api/RevenueReport")]
        public async Task<object> RevenueReport(Revenue revenue)
        {
            return await _reportRepo.RevenueReport(revenue);
        }

        [HttpPost]
        [Route("api/GetMaintenanceReportData")]
        public async Task<Object> GetMaintenanceReportData(Revenue revenue)
        {
            return await _reportRepo.MaintenanceReport(revenue);
        }

        [HttpGet]
        [Route("api/GetSkillsWithTypes")]
        public async Task<object> GetSkillsWithTypes()
        {
            return await _reportRepo.GetSkillsWithTypes();
        }

        [HttpGet]
        [Route("api/GetEmployeesWithSkill/{id}")]
        public async Task<object> GetEmployeesWithSkill(int id)
        {
            return await _reportRepo.GetEmployeesWithSkill(id);
        }

        [HttpPost]
        [Route("api/GetContacts")]
        public async Task<object> GetContacts(Revenue revenue)
        {
            return await _reportRepo.GetContacts(revenue);
        }

        [HttpPost]
        [Route("api/GetSales")]
        public async Task<object> GetSales(Revenue revenue)
        {
            return await _reportRepo.GetSales(revenue);
        }

        [HttpGet]
        [Route("api/GetDashboardData")]
        public async Task<object> GetDashboardData()
        {
            return await _reportRepo.GetDashboardData();
        }
    }
}
