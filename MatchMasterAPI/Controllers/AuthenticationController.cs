using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MatchMasterAPI.Models;
using System.Security.Cryptography;
using System.Text;


namespace MatchMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly MatchMasterContext _context;

        public AuthenticationController(MatchMasterContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User userToRegister, string password)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == userToRegister.Email))
                return BadRequest("Email is already taken");

            // Generate Salt
            byte[] salt = GenerateSalt(16);

            // Hash the password
            var passwordHash = HashPassword(password, salt);

            var userToCreate = new User
            {
                Username = userToRegister.Username,
                Email = userToRegister.Email,
                HashedPassword = passwordHash,
                Salt = salt
            };

            _context.Users.Add(userToCreate);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Login model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.Email == model.Email);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var hashedPassword = HashPassword(model.Password, user.Salt);

            if(hashedPassword.SequenceEqual(user.HashedPassword))
            {
                return Ok(new { Message = "Login successful", UserId = user.UserId});
            }
            else
            {
                return BadRequest("Wrong password");
            }
        }


        // Helper methods to generate password and salt ====================================
        private byte[] HashPassword(string password, byte[] salt)
        {
            byte[] passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
            byte[] combineBytes = passwordBytes.Concat(salt).ToArray();

            using(var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(combineBytes);
                return hashedBytes;
            }
        }

        private byte[] GenerateSalt(int length)
        {
            byte[] salt = new byte[length];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }
    }
}
