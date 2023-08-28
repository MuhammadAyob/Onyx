using System;
using System.Collections.Generic;
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
    }
}