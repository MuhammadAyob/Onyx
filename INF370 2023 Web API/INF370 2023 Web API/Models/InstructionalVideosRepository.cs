using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class InstructionalVideosRepository : IInstructionalVideos
    {
        //Dependency injection

        private readonly Entities db;

        public InstructionalVideosRepository(Entities database)
        {
            this.db = database;
        }

        private async Task <bool> InstructionalVideoExists(int id)
        {
            return await db.InstructionalVideos.CountAsync(e => e.VideoID == id) > 0;
        }

        private async Task <bool> VideoNameExists(string name)
        {
            var exists = await db.InstructionalVideos.Where(p => p.VideoName == name).FirstOrDefaultAsync();
            return exists != null;
        }

        // //////////////////////////////////////////////////////////////////

        public async Task<object> GetInstructionalVideos()
        {
            try
            {
                return await db.InstructionalVideos.ToListAsync();
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetInstructionalVideosDetails()
        {
            try
            {
                List<dynamic> listInstructionalVideos = new List<dynamic>();

                List<InstructionalVideo> instructionalVideo = await db.InstructionalVideos.ToListAsync();

                foreach (InstructionalVideo instructionalVideos in instructionalVideo)
                {
                    dynamic obj = new ExpandoObject();
                    obj.VideoID = instructionalVideos.VideoID;
                    obj.Description = instructionalVideos.Description;
                    obj.VideoName = instructionalVideos.VideoName;
                    obj.VideoLink = instructionalVideos.VideoLink;
                    listInstructionalVideos.Add(obj);
                }
                return listInstructionalVideos;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddInstructionalVideo([FromBody] InstructionalVideo instructionalVideo)
        {
            try
            {
                //check exists

                if (await VideoNameExists(instructionalVideo.VideoName))
                {
                    return new { Status = 404, Message = "Video exists" };
                }

                var dup = await db.InstructionalVideos.Where(x => x.VideoLink == instructionalVideo.VideoLink).FirstOrDefaultAsync();
                if (dup != null)
                {
                    return new { Status = 600, Message = "Video Link exists" };
                }

                db.InstructionalVideos.Add(instructionalVideo);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Video added" };

            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateInstructionalVideo(int id, InstructionalVideo instructionalVideo)
        {
            try
            {
                var vid = await db.InstructionalVideos.Where(x => x.VideoName == instructionalVideo.VideoName && x.VideoID != id).FirstOrDefaultAsync();
                if (vid != null)
                {
                    return new { Status = 404, Message = "Video exists" };
                }

                var dup = await db.InstructionalVideos.Where(x => x.VideoLink == instructionalVideo.VideoLink && x.VideoID != id).FirstOrDefaultAsync();
                if(dup != null)
                {
                    return new { Status = 600, Message = "Video Link exists" };
                }

                db.Entry(instructionalVideo).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Video updated" };

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteInstructionalVideo(int id)
        {
            try
            {
                InstructionalVideo Video = await db.InstructionalVideos.FindAsync(id);
                if (Video == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                db.InstructionalVideos.Remove(Video);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Video deleted" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetVideoName(string name)
        {
            try
            {
                InstructionalVideo Video = await db.InstructionalVideos.Where(x => x.VideoName.ToLower().Contains(name.Trim().ToLower())).FirstOrDefaultAsync();
                if (Video == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return Video;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetInstructionalVideo(int id)
        {
            try
            {
                InstructionalVideo Video = await db.InstructionalVideos.FindAsync(id);
                if (Video == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return Video;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}