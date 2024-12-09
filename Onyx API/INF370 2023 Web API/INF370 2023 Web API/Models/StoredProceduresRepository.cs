using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class StoredProceduresRepository:IStoredProcedures
    {
        private readonly Entities db;

        public StoredProceduresRepository(Entities database)
        {
            this.db = database;
        }

        public object GetContacts(Revenue revenue)
        {
            var data = db.GetContacts(revenue.startDate, revenue.endDate);
            return data;
        }

        public object GetCoursePerformanceReport(int id)
        {
            var data = db.GetCoursePerformance(id);
            return data;
        }

        public object GetCourses()
        {
            var data = db.GetCourses();
            return data;
        }

        public object GetDashboardData()
        {
            var data = db.GetDashboardData();
            return data;
        }

        public object GetEmployeesWithSkills(int id)
        {
            var skills = db.GetEmployeesWithSkill(id);
            return skills;
        }

        public object GetMaintenance(int maintenanceId)
        {
            var maintenanceData = db.GetMaintenance(maintenanceId);
            return maintenanceData;
        }

        public object GetMaintenanceList()
        {
            var data = db.GetMaintenanceList();
            return data;
        }

        public object GetSales(Revenue revenue)
        {
            var data = db.GetSales(revenue.startDate, revenue.endDate);
            return data;
        }

        public object GetSkillsWithTypes()
        {
            var data = db.GetSkillsWithTypes();
            return data;
        }

        public object RevenueReport(Revenue revenue)
        {
            var data = db.GetRevenueReport(revenue.startDate,revenue.endDate);
            return data;
        }

       
    }
}