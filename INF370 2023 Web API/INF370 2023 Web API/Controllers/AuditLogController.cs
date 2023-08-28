using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class AuditLogController : ApiController
    {
        private readonly IAuditLogs _auditRepo;

        public AuditLogController(IAuditLogs auditRepo)
        {
            this._auditRepo = auditRepo;
        }

        [HttpPost]
        [Route("api/AddAudit")]
        public async Task<object> AddAudit(AuditLog audit)
        {
            return await _auditRepo.AddAudit(audit);
        }
    }
}
