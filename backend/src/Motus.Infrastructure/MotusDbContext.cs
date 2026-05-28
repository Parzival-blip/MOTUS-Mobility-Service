using Microsoft.EntityFrameworkCore;
using Motus.Domain;

namespace Motus.Infrastructure;

public sealed class MotusDbContext(DbContextOptions<MotusDbContext> options) : DbContext(options)
{
    public DbSet<Enterprise> Enterprises => Set<Enterprise>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<RoutePlan> Routes => Set<RoutePlan>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
        modelBuilder.Entity<Enterprise>().HasIndex(enterprise => enterprise.BillingCode).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(booking => booking.BookingNumber).IsUnique();
        modelBuilder.Entity<Invoice>().HasIndex(invoice => invoice.InvoiceNumber).IsUnique();

        modelBuilder.Entity<User>().HasMany(user => user.Roles).WithMany();
        modelBuilder.Entity<Role>().HasMany(role => role.Permissions).WithMany();
    }
}
