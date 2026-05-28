namespace Motus.Domain;

public abstract class Entity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
}

public sealed class Enterprise : Entity
{
    public required string Name { get; set; }
    public required string Industry { get; set; }
    public required string BillingCode { get; set; }
    public List<Employee> Employees { get; set; } = [];
}

public sealed class User : Entity
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public Guid EnterpriseId { get; set; }
    public List<Role> Roles { get; set; } = [];
}

public sealed class Role : Entity
{
    public required string Name { get; set; }
    public List<Permission> Permissions { get; set; } = [];
}

public sealed class Permission : Entity
{
    public required string Key { get; set; }
    public required string Description { get; set; }
}

public sealed class Employee : Entity
{
    public Guid EnterpriseId { get; set; }
    public required string EmployeeCode { get; set; }
    public required string FullName { get; set; }
    public required string Department { get; set; }
    public required string ShiftWindow { get; set; }
    public required string HomeZone { get; set; }
}

public sealed class Vendor : Entity
{
    public required string Name { get; set; }
    public required string ComplianceStatus { get; set; }
}

public sealed class Driver : Entity
{
    public required string FullName { get; set; }
    public required string LicenseNumber { get; set; }
    public required string VerificationStatus { get; set; }
    public Guid? VendorId { get; set; }
}

public sealed class Vehicle : Entity
{
    public required string UnitCode { get; set; }
    public required string Category { get; set; }
    public required string FuelType { get; set; }
    public int Capacity { get; set; }
    public required string Status { get; set; }
    public Guid? VendorId { get; set; }
    public Guid? DriverId { get; set; }
}

public sealed class RoutePlan : Entity
{
    public required string Name { get; set; }
    public required string OriginZone { get; set; }
    public required string Destination { get; set; }
    public decimal DistanceKm { get; set; }
    public required string RiskLevel { get; set; }
}

public sealed class Schedule : Entity
{
    public required string ScheduleType { get; set; }
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset? EndsAt { get; set; }
    public required string RecurrenceRule { get; set; }
}

public sealed class Booking : Entity
{
    public required string BookingNumber { get; set; }
    public Guid EnterpriseId { get; set; }
    public Guid RoutePlanId { get; set; }
    public Guid ScheduleId { get; set; }
    public int PassengerCount { get; set; }
    public required string Department { get; set; }
    public required string Status { get; set; }
    public required string ApprovalState { get; set; }
}

public sealed class Invoice : Entity
{
    public Guid EnterpriseId { get; set; }
    public required string InvoiceNumber { get; set; }
    public decimal Amount { get; set; }
    public required string Status { get; set; }
}

public sealed class Notification : Entity
{
    public Guid EnterpriseId { get; set; }
    public required string Channel { get; set; }
    public required string Subject { get; set; }
    public required string Body { get; set; }
    public required string Status { get; set; }
}
