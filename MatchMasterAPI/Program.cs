using MatchMasterAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<MatchMasterContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MatchMasterConnection")));

// Add Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "MatchMaster API", Version = "v1" });
});

var app = builder.Build();

// Enable CORS
app.UseCors(options =>
{
    options.AllowAnyOrigin();
    options.AllowAnyHeader();
    options.AllowAnyMethod();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MatchMaster API");
        // Optionally, configure the Swagger UI route
        c.RoutePrefix = "swagger"; // Customize the Swagger UI route
    });
}

app.UseHttpsRedirection();

// Enable middleware to handle HTTP requests
app.UseRouting();

// Enable middleware to use endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // Map controllers to endpoints
});

app.Run();