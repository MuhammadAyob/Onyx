using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IStudents
    {
        Task<object> GetStudents();

        Task<object> GetStudentName(int id);

        Task<object> UpdateStudent(int id, Student student);

        Task<object> GetStudentID(int id);

        Task<object> DeleteStudent(int id, Student student);

        Task<object> DeactivateStudent(int id);
    }
}
