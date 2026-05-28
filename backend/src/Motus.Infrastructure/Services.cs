using Microsoft.EntityFrameworkCore;
using Motus.Application;
using Motus.Domain;

namespace Motus.Infrastructure;

public sealed class EfRepository<T>(MotusDbContext dbContext) : IRepository<T> where T : Entity
{
    public Task<T?> GetAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Set<T>().FirstOrDefaultAsync(entity => entity.Id == id, cancellationToken);

    public async Task<IReadOnlyList<T>> ListAsync(PagedRequest request, CancellationToken cancellationToken) =>
        await dbContext.Set<T>()
            .OrderByDescending(entity => entity.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken)
    {
        await dbContext.Set<T>().AddAsync(entity, cancellationToken);
        return entity;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}

public sealed class BookingService(MotusDbContext dbContext) : IBookingService
{
    public async Task<BookingDto> CreateBulkBookingAsync(CreateBulkBookingRequest request, CancellationToken cancellationToken)
    {
        var route = new RoutePlan
        {
            Name = $"{request.OriginZone} to {request.Destination}",
            OriginZone = request.OriginZone,
            Destination = request.Destination,
            DistanceKm = 0,
            RiskLevel = "Standard"
        };

        var schedule = new Schedule
        {
            ScheduleType = request.ScheduleType,
            StartsAt = DateTimeOffset.UtcNow.AddHours(2),
            RecurrenceRule = request.ScheduleType == "recurring" ? "FREQ=DAILY" : "ONCE"
        };

        var booking = new Booking
        {
            BookingNumber = $"BK-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}",
            EnterpriseId = request.EnterpriseId,
            Department = request.Department,
            PassengerCount = request.PassengerCount,
            RoutePlanId = route.Id,
            ScheduleId = schedule.Id,
            Status = "Allocating",
            ApprovalState = "Pending"
        };

        await dbContext.Routes.AddAsync(route, cancellationToken);
        await dbContext.Schedules.AddAsync(schedule, cancellationToken);
        await dbContext.Bookings.AddAsync(booking, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new BookingDto(booking.Id, booking.BookingNumber, booking.Department, booking.PassengerCount, booking.Status, booking.ApprovalState);
    }

    public async Task<PagedResult<BookingDto>> ListBookingsAsync(PagedRequest request, CancellationToken cancellationToken)
    {
        var query = dbContext.Bookings.OrderByDescending(booking => booking.CreatedAt);
        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(booking => new BookingDto(booking.Id, booking.BookingNumber, booking.Department, booking.PassengerCount, booking.Status, booking.ApprovalState))
            .ToListAsync(cancellationToken);

        return new PagedResult<BookingDto>(items, request.Page, request.PageSize, total);
    }
}
