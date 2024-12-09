using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IInstructionalVideos
    {
        Task<object> GetInstructionalVideos();

        Task<object> GetInstructionalVideosDetails();

        Task<object> AddInstructionalVideo([FromBody] InstructionalVideo instructionalVideo);

        Task<object> UpdateInstructionalVideo(int id, InstructionalVideo instructionalVideo);

        Task<object> DeleteInstructionalVideo(int id);

        Task<object> GetVideoName(string name);

        Task<object> GetInstructionalVideo(int id);
    }
}
