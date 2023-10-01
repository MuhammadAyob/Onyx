using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IJobOpp
    {
        Task<object> AddJobOpp(JobOpportunity job);
        Task<object> UpdateJobOpp(int id, JobOpportunity updatedJob);
        Task<object> DeleteJobOpp(int id);
        Task<object> GetJobOpps();
        Task<object> GetWorkTypes();
        Task<object> GetStatuses();
        Task<object> ExpiredJobOpportunity();
        Task<object> GetActiveJobs();
    }
}
