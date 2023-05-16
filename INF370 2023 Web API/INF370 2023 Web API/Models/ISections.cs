using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface ISections
    {
        Task<object> GetCourseSections(int id);

        Task<object> MaintainSection(int id);

        Task<object> UpdateSection(int id, Section section);

        Task<object> AddSection([FromBody] Section section);

        Task<object> DeleteSection(int id);

    }
}
