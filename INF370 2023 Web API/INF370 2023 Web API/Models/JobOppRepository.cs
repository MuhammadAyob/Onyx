using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class JobOppRepository: IJobOpp
    {
        //Dependency injection

        private readonly Entities db;

        public JobOppRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddJobOpp(JobOpportunity job)
        {
            try
            {
                var dup = await db.JobOpportunities.Where(x => x.JobOppTitle == job.JobOppTitle && x.JobOppStatusID != 3).FirstOrDefaultAsync();
                if (dup != null)
                {
                    return new { Status = 400, Message = "Job exists" };
                }

                 db.JobOpportunities.Add(job);
                 await db.SaveChangesAsync();

                return new { Status = 200, Message = "Job added" };
            }
            catch (Exception)
            {
                return new { Status = 501, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteJobOpp(int id)
        {
            try
            {
                JobOpportunity job = await db.JobOpportunities.FindAsync(id);
                job.JobOppStatusID = 3;
                db.Entry(job).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Job disabled" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> ExpiredJobOpportunity()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled=false;
                List<JobOpportunity> opportunity = await db.JobOpportunities.Where(s => s.JobOppStatusID !=3).ToListAsync();
                
                foreach (JobOpportunity job in opportunity)
                {
                    if ((DateTime.Now).AddDays(-1) > job.JobOppDeadline)

                    {
                        job.JobOppStatusID = 2;
                        db.Entry(job).State = EntityState.Modified;

                    }
                    await db.SaveChangesAsync();
                }

                return new { Status = 200, Message = "Status updated" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetJobOpps()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.JobOpportunities.Where(o=>o.JobOppStatusID != 3)
                            .Join(db.JobOppStatus,
                             job => job.JobOppStatusID,
                             status => status.JobOppStatusID,
                             (job, status) => new { Job = job, Status = status })
                             .Join(db.WorkTypes,
                                   jobStatus => jobStatus.Job.WorkTypeID,
                                   workType => workType.WorkTypeID,
                                   (jobStatus, workType) => new { jobStatus.Job, jobStatus.Status, WorkType = workType })
                             .Select(j => new 
                             {
                                 j.Job.JobOppID,
                                 j.Job.JobOppTitle,
                                 j.Job.JobOppDescription,
                                 j.Job.JobOppRequirements,
                                 j.Job.JobOppDeadline,
                                 j.Job.WorkTypeID,
                                 j.WorkType.Type,
                                 j.Job.JobOppStatusID,
                                 j.Status.Status,
                             }).ToListAsync();

                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetStatuses()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.JobOppStatus.Where(x => x.JobOppStatusID != 3).ToListAsync();
                return obj;

            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetWorkTypes()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.WorkTypes.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateJobOpp(int id, JobOpportunity job)
        {
            try
            {
                var dup = await db.JobOpportunities.Where(x => x.JobOppTitle == job.JobOppTitle && x.JobOppStatusID != 3 && x.JobOppID != id).FirstOrDefaultAsync();
                if (dup != null)
                {
                    return new { Status = 400, Message = "Job exists" };
                }

               

                db.Entry(job).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Job updated" };

            }
            catch (Exception)
            {
                return new { Status = 501, Message = "Internal server error, please try again" };
            }
        }


    }
}