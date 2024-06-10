using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MatchMasterAPI.Models;

namespace MatchMaster.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MatchMasterContext _context;

        public UsersController(MatchMasterContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/Users/5/Created/Tournaments
        [HttpGet("{id}/Created/Tournaments")]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetUserCreatedTournaments(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                var tournaments = await _context.Tournaments
                .Where(tournament => tournament.CreatorId == id)
                .ToListAsync();

                return tournaments;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a generic error message to the client
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        // GET: api/Users/5/Past/Tournaments
        [HttpGet("{id}/Past/Tournaments")]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetUserPastTournaments(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                var today = DateTime.UtcNow.Date;

                var tournaments = await _context.Tournaments
                .Where(tournament => tournament.TournamentParticipants
                .Any(participant => participant.UserId == id)
                && tournament.TournamentStart.HasValue
                && tournament.TournamentStart.Value.Date < today)
                .ToListAsync();

                return tournaments;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a generic error message to the client
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        // GET: api/Users/5/Upcoming/Tournaments
        [HttpGet("{id}/Upcoming/Tournaments")]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetUserUpcomingTournaments(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                var today = DateTime.UtcNow.Date;

                var tournaments = await _context.Tournaments
                .Where(tournament => tournament.TournamentParticipants
                .Any(participant => participant.UserId == id)
                && tournament.TournamentStart.HasValue
                && tournament.TournamentStart.Value.Date >= today)
                .ToListAsync();

                return tournaments;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a generic error message to the client
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        // GET: api/Users/5/Past/Matches
        [HttpGet("{id}/Past/Matches")]
        public async Task<ActionResult<IEnumerable<Match>>> GetUserPastMatches(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                var today = DateTime.UtcNow.Date;

                var matches = await _context.Matches
                .Where(match => match.MatchParticipants
                .Any(participant => participant.UserId == id)
                && match.MatchStart.HasValue
                && match.MatchStart.Value.Date < today)
                .ToListAsync();

                return matches;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a generic error message to the client
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        // GET: api/Users/5/Upcoming/Matches
        [HttpGet("{id}/Upcoming/Matches")]
        public async Task<ActionResult<IEnumerable<Match>>> GetUserUpcomingMatches(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                var today = DateTime.UtcNow.Date;

                var matches = await _context.Matches
                .Where(match => match.MatchParticipants
                .Any(participant => participant.UserId == id)
                && match.MatchStart.HasValue
                && match.MatchStart.Value.Date >= today)
                .ToListAsync();

                return matches;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Return a generic error message to the client
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        // POST: api/Users/5/Tournament/1
        [HttpPost("{id}/Tournament/{tournamentId}")]
        public async Task<IActionResult> JoinTournament(int id, int tournamentId)
        {
            var participant = new TournamentParticipant
            {
                UserId = id,
                TournamentId = tournamentId
            };

            _context.TournamentParticipants.Add(participant);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
