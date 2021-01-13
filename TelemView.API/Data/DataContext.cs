using Microsoft.EntityFrameworkCore;
using TelemView.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace TelemView.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>,
    UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserRole>(
            userRole => {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(userRole=>userRole.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

                userRole.HasOne(userRole=>userRole.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            }
        );

        modelBuilder.Entity<ProductStudent>().HasKey(sc => new { sc.StudentId, sc.ProductId });
        modelBuilder.Entity<ProductCourse>().HasKey(sc => new { sc.CourseId, sc.ProductId });
        modelBuilder.Entity<ProductLecturer>().HasKey(sc => new { sc.LecturerId, sc.ProductId });
        modelBuilder.Entity<ProductTag>().HasKey(sc => new { sc.TagId, sc.ProductId });
        modelBuilder.Entity<OrganizationsAndTypes>().HasKey(sc => new { sc.OrganizationId, sc.OrganizationTypeId });

        modelBuilder.Entity<Product>()
        .HasOne(o => o.Organization)
        .WithMany(p => p.Products)
        .OnDelete(DeleteBehavior.Restrict)
        .HasForeignKey(o => o.OrganizationId);

        modelBuilder.Entity<Product>()
        .HasOne(t => t.Task)
        .WithMany(p => p.Products)
        .OnDelete(DeleteBehavior.Restrict)
        .HasForeignKey(t => t.TaskId);

        modelBuilder.Entity<Product>()
        .HasOne(pt => pt.ProductType)
        .WithMany(p => p.Products)
        .OnDelete(DeleteBehavior.Restrict)
        .HasForeignKey(pt => pt.ProductTypeId);
        }
        

        public DbSet<Product> Products { get; set; }
        public DbSet<Task> Tasks {get; set;}
        public DbSet<Media> Media {get; set;}
        public DbSet<Organization> Organizations {get; set;}
        public DbSet<OrganizationType> OrganizationTypes {get; set;}
        public DbSet<ProductType> ProductTypes {get; set;}
        public DbSet<Student> Students {get; set;}
        public DbSet<Course> Courses {get; set;}
        public DbSet<Lecturer> Lecturers {get; set;}
        public DbSet<Tag> Tags {get; set;}
        public DbSet<ProductStudent> ProductsStudents {get; set;}
        public DbSet<ProductCourse> ProductsCourses {get; set;}
        public DbSet<ProductLecturer> ProductsLecturers {get; set;}
        public DbSet<ProductTag> ProductsTags {get; set;}
        public DbSet<OrganizationsAndTypes> OrganizationsAndTypes {get; set;}
    }
}