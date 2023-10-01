using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class AuditRepository : IAuditLogs
    {
        private readonly Entities db;

        public AuditRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddAudit(AuditLog audit)
        {
            try
            {
                audit.Date = DateTime.Now;
                db.AuditLogs.Add(audit);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Saved" };
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
           

        }

        public async Task<object> GetAudits(Revenue revenue)
        {
            try
            {

                var auditData = await db.AuditLogs.Include(e => e.User)
     .Where(x => DbFunctions.TruncateTime(x.Date) >= DbFunctions.TruncateTime(revenue.startDate) &&
                 DbFunctions.TruncateTime(x.Date) <= DbFunctions.TruncateTime(revenue.endDate))
     .OrderByDescending(z => z.AuditLogID)
     .Select(x => new
     {
         User = x.User.Username,
         Date = x.Date,
         AuditName = x.AuditName,
         Description = x.Description
     })
     .ToListAsync();

                var audit = auditData.Select(x => new
                {
                    User = x.User,
                    Date = x.Date.ToString("dd/MM/yyyy HH:mm:ss"),
                    AuditName = x.AuditName,
                    Description = x.Description
                }).ToList();

                return audit;

            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}