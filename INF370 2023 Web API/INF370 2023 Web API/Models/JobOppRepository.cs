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
                return new { Status = 500, Message = "Internal server error, please try again" };
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
                    if (DateTime.Today > job.JobOppDeadline)

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
                                JobOppID = j.Job.JobOppID,
                                JobOppTitle = j.Job.JobOppTitle,
                                JobOppDescription = j.Job.JobOppDescription,
                                JobOppRequirements = j.Job.JobOppRequirements,
                                JobOppDeadline = j.Job.JobOppDeadline,
                                WorkTypeID = j.Job.WorkTypeID,
                                WorkType = j.WorkType.Type,
                                JobOppStatusID = j.Job.JobOppStatusID,
                                Status = j.Status.Status,
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

        public async Task<object> UpdateJobOpp(int id, JobOpportunity updatedJob)
        {
            try
            {
                var existingJob = await db.JobOpportunities.FindAsync(id);

                if (existingJob == null)
                {
                    return new { Status = 404, Message = "Job not found" };
                }

                // Duplication Case
                var duplicateJob = await db.JobOpportunities.FirstOrDefaultAsync(x =>
                    x.JobOppTitle == updatedJob.JobOppTitle &&
                    x.JobOppStatusID != 3 &&
                    x.JobOppID != id);

                if (duplicateJob != null)
                {
                    return new { Status = 400, Message = "Job already exists" };
                }

                if (updatedJob.JobOppStatusID == 2 && updatedJob.JobOppDeadline.Date < DateTime.Today.Date && updatedJob.JobOppDeadline.Date != existingJob.JobOppDeadline.Date)
                {
                    return new { Status = 601, Message = "You can't change an expired opportunity's deadline to a date prior to today" };
                }

                // Update the existingJob entity with the changes from updatedJob
                db.Entry(existingJob).CurrentValues.SetValues(updatedJob);

                // Handle different cases
                if (updatedJob.JobOppDeadline.Date == DateTime.Today.AddDays(-1).Date && updatedJob.JobOppStatusID == 1)
                {
                    existingJob.JobOppStatusID = 2;
                }
                else if (updatedJob.JobOppDeadline.Date < DateTime.Today.AddDays(-1).Date && updatedJob.JobOppStatusID == 1)
                {
                    return new { Status = 600, Message = "You can't change the deadline prior to yesterday" };
                }
               
                else if (updatedJob.JobOppDeadline.Date >= DateTime.Today.Date && updatedJob.JobOppStatusID == 2)
                {
                    existingJob.JobOppStatusID = 1;
                }

                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Job updated" };
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }



    }
}