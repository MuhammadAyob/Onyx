using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class ApplicationsRepository : IApplications
    {
        private readonly Entities db;

        public ApplicationsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddShortList(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();

                application.ApplicationStatusID = 3;
                db.Entry(application).State = EntityState.Modified;
                await db.SaveChangesAsync();

                ShortList shor = new ShortList();
                shor.ShortListID = 0;
                shor.ApplicationID = application.ApplicationID;

                db.ShortLists.Add(shor);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Applicant shortlisted" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetApplications()
        {
            try
            {
                List<dynamic> listUpdate = new List<dynamic>();

                List<Application> applications = await db.Applications.Where(s => s.ApplicationStatusID == 1).ToListAsync();


                foreach (Application request in applications)
                {
                    dynamic obj = new ExpandoObject();
                    obj = await db.Applications.Where(s => s.ApplicationID == request.ApplicationID)
                        .Include(s => s.Applicant)
                        .Select(s => new
                        {
                            ApplicantID = s.ApplicantID,
                            Name = s.Applicant.Name,
                            Surname = s.Applicant.Surname,
                            Email = s.Applicant.Email,
                            //Motivation = s.Applicant.Motivation,
                            CV = s.Applicant.CV,
                            Image = s.Applicant.Image,
                            Phone = s.Applicant.Phone,
                            Biography = s.Applicant.Biography,
                            RSAIDNumber = s.Applicant.RSAIDNumber,
                            JobOpp = s.JobOpportunity.JobOppTitle,
                            ApplicationID = s.ApplicationID

                        }).FirstOrDefaultAsync();

                    listUpdate.Add(obj);
                }
                return listUpdate;
            }


            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> RejectApplicant(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();
                Applicant applicant = await db.Applicants.Where(s => s.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();

                application.ApplicationStatusID = 2;

                db.Entry(application).State = EntityState.Modified;

                await db.SaveChangesAsync();


                string name = applicant.Name;
                string surname = applicant.Surname;
                string email = applicant.Email;


                //Send Rejection Email
                await SendApplicantRejectionEmail(email, name, surname);
                return new { Status = 200, Message = "Applicant rejected" };

                
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        private async Task SendApplicantRejectionEmail(string emailID, string name, string surname)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Application Rejected";
            var message = "Dear, " + name + " " + surname + 
                    "<br/><br/>Thank you for expressing your interest in the Darus Salaam Educational Institute. " +
                    "<br> However, we regret to inform you that your application was unsuccessful" +

                    "<br> We encourage you to visit the job opportunities page of our website to apply for other opportunities that you may be better suited for." +
                    " We wish you the best for all your future endeavours. " +
                    "<br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
                    "<br/> Sincerely, The Onyx Team" +
                    "<br/><h5>Powered by Onyx</h5>";

            using (var compiledMessage = new MailMessage(fromAddress, toAddress))
            {
                compiledMessage.Subject = subject;
                compiledMessage.Body = string.Format(message);
                compiledMessage.IsBodyHtml = true;


                using (var smtp = new SmtpClient())
                {
                    smtp.Host = "smtp.gmail.com"; // for example: smtp.gmail.com
                    smtp.Port = 587;
                    smtp.EnableSsl = true;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential(fromEmailAccount, fromEmailAccountPassword); // your own provided email and password
                    await smtp.SendMailAsync(compiledMessage);
                }
            }
        }
    }
}