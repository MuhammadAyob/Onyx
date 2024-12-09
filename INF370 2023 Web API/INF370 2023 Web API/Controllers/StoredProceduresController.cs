using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class StoredProceduresController : ApiController
    {
        private readonly IStoredProcedures _storedRepo;

        public StoredProceduresController(IStoredProcedures storedRepo)
        {
            this._storedRepo = storedRepo;
        }

        [HttpGet]
        [Route("api/GetContacts2")]
        public object GetContacts(Revenue revenue)
        {
            return _storedRepo.GetContacts(revenue);
        }

        [HttpGet]
        [Route("api/GetCoursePerformanceReport2")]
        public object GetCoursePerformanceReport(int id)
        {
            return _storedRepo.GetCoursePerformanceReport(id);
        }

        [HttpGet]
        [Route("api/GetCourses2")]
        public object GetCourses()
        {
            return _storedRepo.GetCourses();
        }

        [HttpGet]
        [Route("api/GetDashboardData2")]
        public object GetDashboardData()
        {
            return _storedRepo.GetDashboardData();
        }

        [HttpGet]
        [Route("api/GetEmployeesWithSkills2/{id}")]
        public object GetEmployeesWithSkills(int id)
        {
            return _storedRepo.GetEmployeesWithSkills(id);
        }

        [HttpGet]
        [Route("api/GetMaintenance2/{id}")]
        public object GetMaintenance(int maintenanceId)
        {
            return _storedRepo.GetMaintenance(maintenanceId);
        }


        [HttpGet]
        [Route("api/GetMaintenanceList2")]
        public object GetMaintenanceList()
        {
            return _storedRepo.GetMaintenanceList();
        }

        [HttpGet]
        [Route("api/GetSales2")]
        public object GetSales(Revenue revenue)
        {
            return _storedRepo.GetSales(revenue);
        }

        [HttpGet]
        [Route("api/GetSkillsWithTypes2")]
        public object GetSkillsWithTypes()
        {
            return _storedRepo.GetSkillsWithTypes();
        }

        [HttpGet]
        [Route("api/RevenueReport2")]
        public object RevenueReport(Revenue revenue)
        {
            return _storedRepo.RevenueReport(revenue);
        }
    }
}
