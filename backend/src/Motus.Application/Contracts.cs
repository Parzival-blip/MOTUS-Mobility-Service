using Motus.Domain;

namespace Motus.Application;

public sealed record ApiResponse<T>(T Data, string TraceId, IReadOnlyList<string> Errors)
{
    public static ApiResponse<T> Ok(T data, string traceId) => new(data, traceId, []);
}

public sealed record PagedRequest(int Page = 1, int PageSize = 25, string? Search = null, string? Sort = null);
public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount);

public sealed record LoginRequest(string Email, string Password);
public sealed record AuthResponse(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt, UserProfile User);
public sealed record UserProfile(Guid Id, string Name, string Email, string Enterprise, IReadOnlyList<string> Roles);

public sealed record CreateBulkBookingRequest(
    Guid EnterpriseId,
    string Department,
    string ScheduleType,
    int PassengerCount,
    string OriginZone,
    string Destination,
    string? CsvRosterReference);

public sealed record BookingDto(Guid Id, string BookingNumber, string Department, int PassengerCount, string Status, string ApprovalState);
public sealed record VehicleDto(Guid Id, string UnitCode, string Category, string FuelType, int Capacity, string Status);
public sealed record FleetStatusDto(int ActiveVehicles, int StandbyVehicles, int MaintenanceVehicles, decimal UtilizationRate);
public sealed record AnalyticsSummaryDto(decimal OnTimeRate, decimal UtilizationRate, int ActiveTrips, int OpenApprovals);

public interface ITokenService
{
    AuthResponse IssueToken(User user, Enterprise enterprise);
}

public interface IRepository<T> where T : Entity
{
    Task<T?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<T>> ListAsync(PagedRequest request, CancellationToken cancellationToken);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IBookingService
{
    Task<BookingDto> CreateBulkBookingAsync(CreateBulkBookingRequest request, CancellationToken cancellationToken);
    Task<PagedResult<BookingDto>> ListBookingsAsync(PagedRequest request, CancellationToken cancellationToken);
}
