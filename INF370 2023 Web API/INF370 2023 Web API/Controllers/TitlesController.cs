using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class TitlesController : ApiController
    {
        private readonly Entities db = new Entities();


        [HttpGet]
        [Route("api/GetTitles")]
        public async Task<object> GetTitles()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var obj = await db.Titles.ToListAsync();
            return obj;
        }

        [HttpGet]
        [Route("api/GetTitleID/{id}")]
        public async Task<object>GetTitleID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return await db.Titles.Where(x => x.TitleID == id).FirstOrDefaultAsync();
        }
    }
}
