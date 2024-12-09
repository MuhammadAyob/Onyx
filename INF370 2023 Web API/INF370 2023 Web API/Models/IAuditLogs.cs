using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IAuditLogs
    {
        Task<object> AddAudit(AuditLog audit);
        Task<object> GetAudits(Revenue revenue);
      
    }
}
