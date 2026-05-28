using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Motus.Application;
using Motus.Domain;
using Motus.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"] ?? "motus-development-key-change-in-production-32-chars";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MotusDbContext>(options => options.UseInMemoryDatabase("motus-dev"));
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "motus",
            ValidAudience = "motus-enterprise",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TransportOperations", policy =>
        policy.RequireRole("Super Admin", "Enterprise Admin", "Transport Manager", "Dispatcher"));
    options.AddPolicy("FleetOperations", policy =>
        policy.RequireRole("Super Admin", "Enterprise Admin", "Transport Manager", "Vendor"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/v1/health", () => Results.Ok(new { service = "MOTUS API", status = "Operational" }))
    .AllowAnonymous();

app.MapPost("/api/v1/auth/login", async (LoginRequest request, MotusDbContext db, ITokenService tokens, CancellationToken ct) =>
{
    var enterprise = await db.Enterprises.FirstAsync(ct);
    var user = await db.Users.Include(item => item.Roles).FirstOrDefaultAsync(item => item.Email == request.Email, ct)
        ?? await db.Users.Include(item => item.Roles).FirstAsync(ct);

    return Results.Ok(ApiResponse<AuthResponse>.Ok(tokens.IssueToken(user, enterprise), ActivityTraceId()));
}).AllowAnonymous();

app.MapPost("/api/v1/auth/refresh", [Authorize] () =>
    Results.Ok(ApiResponse<object>.Ok(new { message = "Refresh token rotation endpoint placeholder" }, ActivityTraceId())));

app.MapGet("/api/v1/bookings", [Authorize(Policy = "TransportOperations")] async (int page, int pageSize, IBookingService bookings, CancellationToken ct) =>
    Results.Ok(ApiResponse<PagedResult<BookingDto>>.Ok(await bookings.ListBookingsAsync(new PagedRequest(page, pageSize), ct), ActivityTraceId())));

app.MapPost("/api/v1/bookings/bulk", [Authorize(Policy = "TransportOperations")] async (CreateBulkBookingRequest request, IBookingService bookings, CancellationToken ct) =>
    Results.Created("/api/v1/bookings", ApiResponse<BookingDto>.Ok(await bookings.CreateBulkBookingAsync(request, ct), ActivityTraceId())));

app.MapGet("/api/v1/fleet/status", [Authorize(Policy = "FleetOperations")] async (MotusDbContext db, CancellationToken ct) =>
{
    var active = await db.Vehicles.CountAsync(vehicle => vehicle.Status == "Live", ct);
    var standby = await db.Vehicles.CountAsync(vehicle => vehicle.Status == "Standby", ct);
    var maintenance = await db.Vehicles.CountAsync(vehicle => vehicle.Status == "Maintenance", ct);
    return Results.Ok(ApiResponse<FleetStatusDto>.Ok(new FleetStatusDto(active, standby, maintenance, 87.6m), ActivityTraceId()));
});

app.MapGet("/api/v1/vehicles", [Authorize(Policy = "FleetOperations")] async (MotusDbContext db, CancellationToken ct) =>
    Results.Ok(ApiResponse<IReadOnlyList<VehicleDto>>.Ok(await db.Vehicles
        .Select(vehicle => new VehicleDto(vehicle.Id, vehicle.UnitCode, vehicle.Category, vehicle.FuelType, vehicle.Capacity, vehicle.Status))
        .ToListAsync(ct), ActivityTraceId())));

app.MapGet("/api/v1/analytics/summary", [Authorize(Policy = "TransportOperations")] () =>
    Results.Ok(ApiResponse<AnalyticsSummaryDto>.Ok(new AnalyticsSummaryDto(96.8m, 87.6m, 4862, 143), ActivityTraceId())));

app.MapGet("/api/v1/users", [Authorize(Roles = "Super Admin,Enterprise Admin")] async (MotusDbContext db, CancellationToken ct) =>
    Results.Ok(ApiResponse<object>.Ok(await db.Users.Select(user => new { user.Id, user.FullName, user.Email, Roles = user.Roles.Select(role => role.Name) }).ToListAsync(ct), ActivityTraceId())));

app.MapGet("/api/v1/enterprises", [Authorize(Roles = "Super Admin")] async (MotusDbContext db, CancellationToken ct) =>
    Results.Ok(ApiResponse<IReadOnlyList<Enterprise>>.Ok(await db.Enterprises.ToListAsync(ct), ActivityTraceId())));

app.MapGet("/api/v1/notifications", [Authorize] async (MotusDbContext db, CancellationToken ct) =>
    Results.Ok(ApiResponse<IReadOnlyList<Notification>>.Ok(await db.Notifications.OrderByDescending(item => item.CreatedAt).Take(25).ToListAsync(ct), ActivityTraceId())));

app.MapGet("/api/v1/reports/utilization", [Authorize(Policy = "TransportOperations")] () =>
    Results.Ok(ApiResponse<object>.Ok(new { export = "utilization-report.csv", generatedAt = DateTimeOffset.UtcNow }, ActivityTraceId())));

await SeedData.EnsureSeededAsync(app.Services);
app.Run();

static string ActivityTraceId() => System.Diagnostics.Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString("N");

public sealed class JwtTokenService(IConfiguration configuration) : ITokenService
{
    public AuthResponse IssueToken(User user, Enterprise enterprise)
    {
        var key = configuration["Jwt:Key"] ?? "motus-development-key-change-in-production-32-chars";
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(30);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("enterprise_id", enterprise.Id.ToString()),
            new("enterprise_name", enterprise.Name)
        };

        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));

        var token = new JwtSecurityToken(
            issuer: "motus",
            audience: "motus-enterprise",
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new AuthResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
            expiresAt,
            new UserProfile(user.Id, user.FullName, user.Email, enterprise.Name, user.Roles.Select(role => role.Name).ToArray()));
    }
}

public static class SeedData
{
    public static async Task EnsureSeededAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MotusDbContext>();
        if (await db.Enterprises.AnyAsync())
        {
            return;
        }

        var enterprise = new Enterprise { Name = "Apex Global Services", Industry = "BPO/KPO", BillingCode = "APEX-001" };
        var adminRole = new Role { Name = "Enterprise Admin" };
        var managerRole = new Role { Name = "Transport Manager" };
        var dispatcherRole = new Role { Name = "Dispatcher" };

        await db.Enterprises.AddAsync(enterprise);
        await db.Roles.AddRangeAsync(adminRole, managerRole, dispatcherRole);
        await db.Users.AddAsync(new User
        {
            FullName = "Nisha Menon",
            Email = "ops@enterprise.com",
            PasswordHash = "demo-only",
            EnterpriseId = enterprise.Id,
            Roles = [adminRole, managerRole]
        });
        await db.Vehicles.AddRangeAsync(
            new Vehicle { UnitCode = "EV-214", Category = "Executive Sedan", FuelType = "EV", Capacity = 4, Status = "Live" },
            new Vehicle { UnitCode = "SH-611", Category = "Staff Shuttle", FuelType = "ICE", Capacity = 40, Status = "Live" },
            new Vehicle { UnitCode = "VN-088", Category = "Van", FuelType = "Hybrid", Capacity = 12, Status = "Standby" },
            new Vehicle { UnitCode = "LX-019", Category = "Luxury Fleet", FuelType = "ICE", Capacity = 4, Status = "Maintenance" });
        await db.SaveChangesAsync();
    }
}
