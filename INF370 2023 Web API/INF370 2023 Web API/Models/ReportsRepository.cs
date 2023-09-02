using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class ReportsRepository : IReports
    {
        private readonly Entities db;

        public ReportsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> CourseTrendReport()
        {
            try
            {
                var reportData = await db.Courses
                 .GroupJoin(
                     db.CartCourses,
                     course => course.CourseID,
                     cartCourse => cartCourse.CourseID,
                     (course, cartCourses) => new { course, cartCourses }
                 )
                 .SelectMany(
                     joined => joined.cartCourses.DefaultIfEmpty(),
                     (joined, cartCourse) => new
                     {
                         Category = joined.course.CourseCategory.Category,
                         Course = joined.course.Name,
                         NumberofCoursesSold = cartCourse == null ? 0 : 1,
                         TotalRevenue = cartCourse == null ? 0 : cartCourse.PriceAtTimeOfPurchase
                     }
                 )
                 .GroupBy(data => new { data.Category, data.Course })
                 .Select(group => new
                 {
                     Category = group.Key.Category,
                     Course = group.Key.Course,
                     NumberofCoursesSold = group.Sum(item => item.NumberofCoursesSold),
                     TotalRevenue = group.Sum(item => item.TotalRevenue)
                 })
                 .ToListAsync();

                var result = reportData.GroupBy(data => data.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        Courses = group.ToList(),
                        CategoryTotal = group.Sum(item => item.TotalRevenue)
                    })
                    .ToList();

                return result;
            }

           
            catch(Exception ex)
            {
                return ex.ToString();
            }
        }

       

        public async Task<Object> MaintenanceReport(Revenue revenue)
        {
            var maintainanceGroups = await db.Maintenances
    .Include(e => e.User)
    .Include(mt => mt.MaintenanceType)
    .Include(mp => mp.MaintenancePriority)
    .Include(ms => ms.MaintenanceStatu)
    .Where(
        m => m.MaintenanceType.MaintenanceTypeID == m.MaintenanceTypeID &&
        m.MaintenancePriority.MaintenancePriorityID == m.MaintenancePriorityID &&
        m.MaintenanceStatu.MaintenanceStatusID == m.MaintenanceStatusID
    )
    .Select(x => new
    {
        MaintenanceType = x.MaintenanceType.Type,
        Description = x.Description,
        LoggedDate = x.DateLogged,
        ResolvedDate = x.DateResolved,
        Priority = x.MaintenancePriority.Priority,
        LoggedBy = x.User.Username,
        Status = x.MaintenanceStatu.Status,
        Location = x.Location,
        Image = x.Image,
    })
    .Where(x =>
        DbFunctions.TruncateTime(x.LoggedDate) >= DbFunctions.TruncateTime(revenue.startDate) &&
        DbFunctions.TruncateTime(x.LoggedDate) <= DbFunctions.TruncateTime(revenue.endDate))
    .ToListAsync<dynamic>();


            dynamic reportData = new ExpandoObject();
            reportData.ChartData = GetChartData(maintainanceGroups);
            reportData.TableData = maintainanceGroups;

            return reportData;
        }

        private object GetChartData(List<dynamic> maintainanceList)
        {
            var mainatinaceTypes = maintainanceList.GroupBy(x => x.MaintenanceType).Select(x => new
            {
                Name = x.Key,
                Total = x.Count()
            });
            return mainatinaceTypes;
        }

        public async Task<object> RevenueReport(Revenue revenue)
        {
            try
            {
                var reportData = await db.CartCourses
    .Join(db.Courses, cc => cc.CourseID, c => c.CourseID, (cc, c) => new { cc, c })
    .Join(db.Carts, joined => joined.cc.CartID, cart => cart.CartID, (joined, cart) => new { joined.cc, joined.c, cart })
    .Where(joined =>
        DbFunctions.TruncateTime(joined.cart.Date) >= DbFunctions.TruncateTime(revenue.startDate) &&
        DbFunctions.TruncateTime(joined.cart.Date) <= DbFunctions.TruncateTime(revenue.endDate))
    .GroupBy(joined => new { joined.cart.Date.Year, joined.c.Name })
    .Select(group => new
    {
        Year = group.Key.Year,
        Course = group.Key.Name,
        NumberofCoursesSold = group.Count(),
        TotalRevenue = group.Sum(joined => joined.cc.PriceAtTimeOfPurchase)
    })
    .ToListAsync();

                var result = reportData.GroupBy(data => data.Year)
                    .Select(yearGroup => new
                    {
                        Year = yearGroup.Key,
                        Courses = yearGroup.ToList(),
                        YearTotal = yearGroup.Sum(item => item.TotalRevenue)
                    })
                    .ToList();

                return result;

            }
            catch (Exception ex)
            {
                // Handle exceptions here
                return ex.ToString();
            }
        }

        public async Task<object> GetCourses()
        {
            try
            {
                var courses = await db.Courses.Select(c => new { c.CourseID, c.Name }).ToListAsync();
                return courses;
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                return ex.ToString();
            }
        }

        public async Task<object> CoursePerformance(int id)
        {
            try
            {
                var courseRatings = await db.CourseRatings
                    .Where(r => r.CourseID == id)
                    .Select(r => new
                    {
                        Date = r.Date,
                        Name = r.Student.Name,
                        Surname = r.Student.Surname,
                        Rating = r.Rating,
                        Comment = r.Comment
                    })
                    .ToListAsync();

                // Create an array to store the rating counts for all possible ratings (1 to 5)
                var ratingCounts = new int[5];

                // Calculate the count for each rating
                foreach (var rating in courseRatings)
                {
                    ratingCounts[rating.Rating - 1]++;
                }

                // Create an array of objects containing the rating and its count
                var ratingCountsList = ratingCounts
                    .Select((count, index) => new { Rating = index + 1, Count = count })
                    .ToList();

                var response = new
                {
                    Ratings = courseRatings,
                    RatingCounts = ratingCountsList
                };

                return response;
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                return ex.ToString();
            }
        }

        public async Task<object> GetSkillsWithTypes()
        {
            var skillsWithTypes = await db.Skills
            .Include(s => s.SkillType)
            .Select(s => new
            {
                SkillID = s.SkillID,
                Skill = s.SkillName + "-" + s.SkillType.SkillTypeName,
                
            })
            .ToListAsync();

            return skillsWithTypes;
        }

        public async Task<object> GetEmployeesWithSkill(int id)
        {
            var employeesWithSkill = await db.EmployeeSkills
           .Where(es => es.SkillID == id)
           .Select(es => es.Employee)
           .Select(e => new
           {
               EmployeeID = e.EmployeeID,
               Name = e.Name,
               Surname = e.Surname,
               Email = e.Email,
               Phone = e.Phone,
               RSAIDNumber = e.RSAIDNumber
           })
           .ToListAsync();

            return employeesWithSkill;
        }

        public async Task<object> GetContacts(Revenue revenue)
        {
            var queries = await db.Contacts.Where(c => c.Date >= revenue.startDate && c.Date <= revenue.endDate).ToListAsync();
            return queries;
        }

        public async Task<object> GetSales(Revenue revenue)
        {
            var salesData = await db.Carts
    .Where(cart =>
        DbFunctions.TruncateTime(cart.Date) >= DbFunctions.TruncateTime(revenue.startDate) &&
        DbFunctions.TruncateTime(cart.Date) <= DbFunctions.TruncateTime(revenue.endDate))
    .Select(cart => new
    {
        Date = cart.Date,
        CartID = cart.CartID,
        Student = cart.Student.Name + " " + cart.Student.Surname,
        Total = cart.Total
    })
    .ToListAsync();

            var grandTotal = salesData.Sum(cart => cart.Total);

            var result = new
            {
                SalesData = salesData,
                GrandTotal = grandTotal
            };

            return result;

        }

        public async Task<object> GetDashboardData()
        {
            try
            {
                // Create a dynamic list to hold various types of values

                List<dynamic> mixedList = new List<dynamic>();
                dynamic obj = new ExpandoObject();

                db.Configuration.ProxyCreationEnabled = false;

                var AE = await db.Employees.CountAsync(x => x.Deleted == "False");
                
                var AC = await db.Courses.CountAsync(x => x.Active == "True");
               
                var AS = await db.Students.CountAsync(x => x.Deleted == "False");
               
                var PM = await db.Maintenances.CountAsync(x => x.MaintenanceStatusID == 1);
               
                var AJ = await db.JobOpportunities.CountAsync(x => x.JobOppStatusID == 1);
               
                var PA = await db.Applications.CountAsync(x => x.ApplicationStatusID == 1);
               
                //

                DateTime today = DateTime.Today;
                DateTime sevenDaysAgo = today.AddDays(-7);
                DateTime monthAgo = today.AddDays(-31);
                //

                var CQ = await db.Contacts.CountAsync(c => c.Date >= sevenDaysAgo && c.Date <= today);

                ////

                var maintenanceTypeCounts = await db.Maintenances
                .Where(x =>
                           DbFunctions.TruncateTime(x.DateLogged) >= monthAgo &&
                           DbFunctions.TruncateTime(x.DateLogged) <= (today))
                .GroupBy(m => m.MaintenanceType.Type) // Group by MaintenanceType
                .Select(group => new
                {
                    MaintenanceType = group.Key,
                    Count = group.Count()
                })
                .ToListAsync();

                ////

                var revenuePerYear = await db.Carts
               .GroupBy(cart => cart.Date.Year) // Group by year
               .Select(group => new
               {
                   Year = group.Key,
                   Revenue = group.Sum(cart => cart.Total)
               })
               .ToListAsync();

                /////

                var UpdateRequests = await db.UpdateRequests.Where(s => s.UpdateRequestStatusID == 1)
                        .Include(s => s.Employee)
                        .Select(s => new
                        {
                            EmployeeName = s.Employee.Name,
                            EmployeeSurname = s.Employee.Surname,
                            UpdateSubject = s.UpdateSubject,

                        })
                        .ToListAsync();

                ////

                obj.ActiveEmployees = AE;
                obj.ActiveCourses = AC;
                obj.ActiveStudents = AS;
                obj.PendingM = PM;
                obj.ActiveJobs = AJ;
                obj.PendingApplicants = PA;
                obj.ContactQ = CQ;
                obj.UpdateRequests = UpdateRequests;
                obj.maintenanceTypeCounts = maintenanceTypeCounts;
                obj.revenuePerYear = revenuePerYear;

                mixedList.Add(obj);
                
                return mixedList;

               
            }

            catch(Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}