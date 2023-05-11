using Ninject;
using Ninject.Extensions.ChildKernel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Dependencies;

//////////////////////////////////////////////////////////////////////////////
//                       Ninject Dependency injection class                 //
//                       DO NOT TOUCH!!!!!!                                 //
////////////////////////////////////////////////////////////////////////////// 

namespace INF370_2023_Web_API.Models
{
    public class NinjectResolver : IDependencyResolver
    {
        private IKernel kernel;

        public NinjectResolver() : this(new StandardKernel())
        {
        }

        public NinjectResolver(IKernel ninjectKernel, bool scope = false)
        {
            kernel = ninjectKernel;
            if (!scope)
            {
                AddBindings(kernel);
            }
        }

        public IDependencyScope BeginScope()
        {
            return new NinjectResolver(AddRequestBindings(new ChildKernel(kernel)), true);
        }

        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }

        public void Dispose()
        {

        }

        private void AddBindings(IKernel kernel)
        {
            // singleton and transient bindings go here
        }

        private IKernel AddRequestBindings(IKernel kernel)
        {
            //Add All Repositories here to inject as services throughout the application for any API calls/requests

            kernel.Bind<IUsers>().To<UsersRepository>().InTransientScope();
            kernel.Bind<IUserRoles>().To<UserRolesRepository>().InSingletonScope();
            kernel.Bind<IDepartments>().To<DepartmentsRepository>().InSingletonScope();
            kernel.Bind<IEmployees>().To<EmployeesRepository>().InSingletonScope();
            kernel.Bind<IStudents>().To<StudentsRepository>().InSingletonScope();
            kernel.Bind<ISkills>().To<SkillsRepository>().InSingletonScope();
            kernel.Bind<ISkillTypes>().To<SkillTypesRepository>().InSingletonScope();
            kernel.Bind<IQualifications>().To<QualificationsRepository>().InSingletonScope();
            kernel.Bind<IUpdateRequests>().To<UpdateRequestsRepository>().InSingletonScope();
            kernel.Bind<IInstructionalVideos>().To<InstructionalVideosRepository>().InSingletonScope();
            kernel.Bind<IMaintenances>().To<MaintenancesRepository>().InSingletonScope();
            kernel.Bind<IMaintenanceTypes>().To<MaintenanceTypesRepository>().InSingletonScope();
            kernel.Bind<IMaintenancePriorities>().To<MaintenancePrioritiesRepository>().InSingletonScope();
            kernel.Bind<IVat>().To<VATRepository>().InSingletonScope();
            kernel.Bind<ITerms>().To<TermsRepository>().InSingletonScope();
            kernel.Bind<IOTPTimer>().To<OTPTimerRepository>().InSingletonScope();
            kernel.Bind<IFaq>().To<FAQRepository>().InSingletonScope();
            kernel.Bind<ICourses>().To<CoursesRepository>().InSingletonScope();
            kernel.Bind<ICourseCategory>().To<CourseCategoryRepository>().InSingletonScope();
            kernel.Bind<ISections>().To<SectionsRepository>().InSingletonScope();
            kernel.Bind<ILessons>().To<LessonsRepository>().InSingletonScope();
            kernel.Bind<ILessonResource>().To<LessonResourceRepository>().InSingletonScope();

            return kernel;
        }
    }

}