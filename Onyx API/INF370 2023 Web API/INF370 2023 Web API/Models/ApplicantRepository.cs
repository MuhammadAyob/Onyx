using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class ApplicantRepository : IApplicants
    {
        private readonly Entities db;

        public ApplicantRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> NewApplication(ApplicantDetails applicant)
        {
            try
            {
                // Case 1: Check if Employee Existssss
                var exists =  await db.Employees.CountAsync(x => x.RSAIDNumber == applicant.RSAIDNumber) > 0;
                if(exists)
                {
                    return new { Status = 300, Message = "Existing employee" };
                }

                // Case 2: Check if there is any applications being processed
                var _applicant = await db.Applicants.Where(x => x.RSAIDNumber == applicant.RSAIDNumber).FirstOrDefaultAsync();
                if(_applicant != null)
                {
                    var __id = _applicant.ApplicantID;
                    var pendingApp = await db.Applications.Where(x => x.ApplicantID == __id && x.ApplicationStatusID != 2).FirstOrDefaultAsync();
                    if (pendingApp != null)
                    {
                        return new { Status = 350, Message = "You must await the process of one application to proceed with another, please await correspondence" };
                    }
                }


                // Case 3: Check if Applicant was previously rejected 
                var _applicant2 = await db.Applicants.Where(x => x.RSAIDNumber == applicant.RSAIDNumber).FirstOrDefaultAsync();
                if (_applicant2 != null)
                {
                    var rejection = await db.Applications.Where(x => x.ApplicantID == _applicant2.ApplicantID && x.JobOppID == applicant.JobOppID && x.ApplicationStatusID == 2).FirstOrDefaultAsync();

                    if (rejection != null)
                    {
                        return new { Status = 400, Message = "You cannot reapply for a rejected application." };
                    }
                }
               

                // Case 4: Check if applicant exists
                var appliExists = await db.Applicants.Where(x => x.RSAIDNumber == applicant.RSAIDNumber).FirstOrDefaultAsync();
                if(appliExists != null)
                {

                    bool _phone = await db.Applicants.CountAsync(x => x.Phone == applicant.Phone && x.ApplicantID != appliExists.ApplicantID) > 0 || await db.Employees.CountAsync(x => x.Phone == applicant.Phone) > 0;
                    bool _email = await db.Applicants.CountAsync(x => x.Email == applicant.Email && x.ApplicantID != appliExists.ApplicantID) > 0 || await db.Employees.CountAsync(x => x.Email == applicant.Email) > 0;
                    if (_phone)
                    {
                        return new { Status = 405, Message = "Phone in use with different user or applicant" };
                    }

                    if (_email)
                    {
                        return new { Status = 406, Message = "Email in use with different user or applicant" };
                    }

                    Application newApp = new Application();
                    newApp.JobOppID = applicant.JobOppID;
                    newApp.ApplicationStatusID =  1;
                    newApp.ApplicantID = appliExists.ApplicantID;

                    db.Applications.Add(newApp);
                    await db.SaveChangesAsync();

                    appliExists.Name = applicant.Name;
                    appliExists.Surname = applicant.Surname;
                    appliExists.Email = applicant.Email;
                   // appliExists.Motivation = applicant.Motivation;
                    appliExists.CV = applicant.CV;
                    appliExists.Image = applicant.Image;
                    appliExists.Phone = applicant.Phone;
                    appliExists.Biography = applicant.Biography;
                    
                    db.Entry(appliExists).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    //Send Email
                    await SendApplicationReceivedEmail(applicant.Email, applicant.Name, applicant.Surname, applicant.RSAIDNumber);
                    return new { Status = 200, Message = "Application added" };
                }
                else
                {

                    bool _phone = await db.Applicants.CountAsync(x => x.Phone == applicant.Phone) > 0 || await db.Employees.CountAsync(x => x.Phone == applicant.Phone) > 0;
                    bool _email = await db.Applicants.CountAsync(x => x.Email == applicant.Email) > 0 || await db.Employees.CountAsync(x => x.Email == applicant.Email) > 0;
                   
                    if (_phone)
                    {
                        return new { Status = 405, Message = "Phone in use with different user or applicant" };
                    }

                    if (_email)
                    {
                        return new { Status = 406, Message = "Email in use with different user or applicant" };
                    }

                    Applicant app = new Applicant();
                    app.ApplicantID = 0;
                    app.Name = applicant.Name;
                    app.Surname = applicant.Surname;
                    app.Email = applicant.Email;
                    //app.Motivation = applicant.Motivation;
                    app.CV = applicant.CV;
                    app.Image = applicant.Image;
                    app.Phone = applicant.Phone;
                    app.Biography = applicant.Biography;
                    app.RSAIDNumber = applicant.RSAIDNumber;

                    db.Applicants.Add(app);
                    await db.SaveChangesAsync();

                    var latestID = await db.Applicants.Where(x => x.RSAIDNumber == applicant.RSAIDNumber).FirstOrDefaultAsync();
                    Application newApplication = new Application();
                    newApplication.JobOppID = applicant.JobOppID;
                    newApplication.ApplicationStatusID = 1;
                    newApplication.ApplicantID = latestID.ApplicantID;

                    db.Applications.Add(newApplication);
                    await db.SaveChangesAsync();

                    //Send Email
                    await SendApplicationReceivedEmail(applicant.Email, applicant.Name, applicant.Surname, applicant.RSAIDNumber);
                    return new { Status = 200, Message = "Application added" };


                }


            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }


        private async Task SendApplicationReceivedEmail(string emailID, string name, string surname, dynamic ID)
        {
            var fromEmailAccount = "muhammad.ayob7@gmail.com";
            var fromEmailAccountPassword = "xcwxznfpbsvjaxtv";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Your application has been received!";
            var message = "Dear, " + name + " " + surname + " " + " - " + ID +  
                    "<br/><br/>Thank you for expressing your interest in the Darus Salaam Educational Institute. " +
                    "<br> Your application has been successfully received!" +
  
                    "<br> Please note that you will only be allowed to apply for one position at a time until your application has been fully processed. Please await further updates on your application via your email address. " +
                    "<br/> If you require any further assistance please contact us at info@darussalaamcenter.co.za" +
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