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
    public class ShortlistRepository: IShortList
    {
        private readonly Entities db;

        public ShortlistRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AcceptShortlistedCandidate(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();
                Applicant applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();
                if(application.ApplicationStatusID == 5)
                {
                    var getShort = await db.ShortLists.Where(x => x.ApplicationID == id).FirstOrDefaultAsync();
                    
                    db.ShortLists.Remove(getShort);
                    await db.SaveChangesAsync();

                    db.Applications.Remove(application);
                    await db.SaveChangesAsync();

                    db.Applicants.Remove(applicant);
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "Application completed" };

                }
                else if(application.ApplicationStatusID == 4)
                {
                    return new { Status = 404, Message = "First offer employment before accepting"};
                }
                else
                {
                    return new { Status = 404, Message = "First offer employment before accepting" };
                }
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetShortlist()
        {
            try
            {
                List<dynamic> listUpdate = new List<dynamic>();

                List<Application> applications = await db.Applications.Where(s => s.ApplicationStatusID == 3 || s.ApplicationStatusID == 4 || s.ApplicationStatusID == 5).ToListAsync();


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
                          //  Motivation = s.Applicant.Motivation,
                            CV = s.Applicant.CV,
                            Image = s.Applicant.Image,
                            Phone = s.Applicant.Phone,
                            Biography = s.Applicant.Biography,
                            RSAIDNumber = s.Applicant.RSAIDNumber,
                            JobOpp = s.JobOpportunity.JobOppTitle,
                            ApplicationID = s.ApplicationID,
                            ApplicationStatusID = s.ApplicationStatusID,
                            ApplicationStatus = s.ApplicationStatu.Status

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

        public async Task<object> OfferEmployment(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();
                if(application.ApplicationStatusID == 5)
                {
                    return new { Status = 300, Message = "Applicant has already been offered employment" };
                }
                else if(application.ApplicationStatusID == 4)
                {
                    var getShort = await db.ShortLists.Where(o => o.ApplicationID == id).FirstOrDefaultAsync();
                    var getSlot = await db.InterviewSlots.Where(v => v.ShortListID == getShort.ShortListID).FirstOrDefaultAsync();
                    DateTime interviewDateTime = getSlot.InterviewDate + getSlot.EndTime;
                    if(DateTime.Now > interviewDateTime)
                    {
                        db.InterviewSlots.Remove(getSlot);
                        await db.SaveChangesAsync();

                        application.ApplicationStatusID = 5;
                        db.Entry(application).State = EntityState.Modified;
                        await db.SaveChangesAsync();

                        //Send Employment Email
                        var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();
                        string name = applicant.Name;
                        string surname = applicant.Surname;
                        var email = applicant.Email;

                        await SendEmploymentEmail(email, name, surname);
                        return new { Status = 200, Message="Employement has been offered to applicant" };
                    }
                    else
                    {
                        return new { Status = 400, Message = "Applicant has upcoming interview, please remove slot first" };
                    }
                }
                else
                {
                    application.ApplicationStatusID = 5;
                    db.Entry(application).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    // Send Employment Email
                    var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();
                    string name = applicant.Name;
                    string surname = applicant.Surname;
                    var email = applicant.Email;

                    await SendEmploymentEmail(email, name, surname);
                    return new { Status = 200, Message = "Employement has been offered to applicant" };

                }
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> RejectShortlistedCandidate(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();
                if(application.ApplicationStatusID == 3)
                {
                    var find = await db.ShortLists.Where(x => x.ApplicationID == id).FirstOrDefaultAsync();
                    db.ShortLists.Remove(find);
                    await db.SaveChangesAsync();

                    application.ApplicationStatusID = 2;
                    db.Entry(application).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    //Send Rejection Email
                   
                    var applie = await db.Applications.FindAsync(id);
                    var applier = await db.Applicants.Where(x => x.ApplicantID == applie.ApplicantID).FirstOrDefaultAsync();
                    string name = applier.Name;
                    string surname = applier.Surname;
                    string email = applier.Email;

                    await SendApplicantRejectionEmail(email, name, surname);

                    return new { Status = 200, Message = "Applicant rejected" };
                }
                else if (application.ApplicationStatusID == 4)
                {
                    var getShort = await db.ShortLists.Where(x => x.ApplicationID == id).FirstOrDefaultAsync();
                    var checkSlot = await db.InterviewSlots.Where(z => z.ShortListID == getShort.ShortListID).FirstOrDefaultAsync();

                    DateTime interviewDateTime = checkSlot.InterviewDate + checkSlot.EndTime;
                    if (DateTime.Now > interviewDateTime)
                    {

                        db.InterviewSlots.Remove(checkSlot);
                        await db.SaveChangesAsync();

                        db.ShortLists.Remove(getShort);
                        await db.SaveChangesAsync();

                        var app = await db.Applications.Where(z => z.ApplicationID == getShort.ApplicationID).FirstOrDefaultAsync();
                        app.ApplicationStatusID = 2;
                        db.Entry(app).State = EntityState.Modified;
                        await db.SaveChangesAsync();

                        //send rejection email
                        var applie = await db.Applications.FindAsync(id);
                        var applier = await db.Applicants.Where(x => x.ApplicantID == applie.ApplicantID).FirstOrDefaultAsync();
                        string name = applier.Name;
                        string surname = applier.Surname;
                        string email = applier.Email;

                        await SendApplicantRejectionEmail(email, name, surname);

                        return new { Status = 200, Message = "Applicant rejected" };
                    }
                    else
                    {
                        return new { Status = 400, Message = "Applicant has an upcoming interview, please remove slot first" };
                    }
                }
                else
                {
                    var sshort = await db.ShortLists.Where(x => x.ApplicationID == id).FirstOrDefaultAsync();
                    db.ShortLists.Remove(sshort);
                    await db.SaveChangesAsync();

                    var applicationn = await db.Applications.FindAsync(id);
                    applicationn.ApplicationStatusID = 2;
                    db.Entry(applicationn).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    //Send Confirm Email
                   
                    var applier = await db.Applicants.Where(x => x.ApplicantID == applicationn.ApplicantID).FirstOrDefaultAsync();
                    string name = applier.Name;
                    string surname = applier.Surname;
                    string email = applier.Email;
                    await SendDiscardApplicationEmail(email, name, surname);

                    return new { Status = 200, Message = "Applicant rejected" };
                }
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

         public async Task<object> RemoveFromShortlist(int id)
        {
            try
            {
                Application application = await db.Applications.Where(a => a.ApplicationID == id).FirstOrDefaultAsync();
                
                if(application.ApplicationStatusID == 3)
                {
                    var find = await db.ShortLists.Where(x => x.ApplicationID == id).FirstOrDefaultAsync();
                    db.ShortLists.Remove(find);
                    await db.SaveChangesAsync();

                    application.ApplicationStatusID = 1;
                    db.Entry(application).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "Applicant removed from shortlist" };
                }
                else if(application.ApplicationStatusID == 4)
                {
                    return new { Status = 300, Message = "Delete interview slot first before removing from shortlist" };
                }

                else
                {
                    return new { Status = 400, Message = "Applicant has been offered employment. Reject applicant instead" };
                }

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

        private async Task SendDiscardApplicationEmail(string emailID, string name, string surname)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Termination of Application";
            var message = "Dear, " + name + " " + surname +
                    "<br/><br/>Thank you for expressing your interest in the Darus Salaam Educational Institute. " +
                    "<br> We have acknowledged your decision to not continue with the application process." +

                    "<br> Therefore, this email serves as confirmation of the termination of your application." +
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

        private async Task SendEmploymentEmail(string emailID, string name, string surname)
        {
            string driveLink = "https://drive.google.com/file/d/1hfehgFzGPt9C0m1ZpMv_b-uJvPkB1wnQ/view?usp=sharing";
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Employment Offer";
            var message = "Dear, " + name + " " + surname +
                    "<br/><br/>We are pleased to inform you that your application was successful! " +
                    "<br> After reviewing your employment contract, please fill in all the details and please send your contract to dseiqueries@gmail.com as soon as possible." +
                    "<br> The employment contract can be found here:" + " " + driveLink +
                    "<br> If you decide to reject the employment offer, please contact dseiqueries@gmail.com to inform us of your decision." +
                    
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