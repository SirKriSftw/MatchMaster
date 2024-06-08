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
    public class TournamentsController : ControllerBase
    {
        private readonly MatchMasterContext _context;

        public TournamentsController(MatchMasterContext context)
        {
            _context = context;
        }

        // GET: api/Tournaments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetTournaments()
        {
            return await _context.Tournaments.ToListAsync();
        }

        // GET: api/Tournaments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tournament>> GetTournament(int id)
        {
            var tournament = await _context.Tournaments.FindAsync(id);

            if (tournament == null)
            {
                return NotFound();
            }

            return tournament;
        }

        // GET: api/Tournaments/5/Matches
        [HttpGet("{id}/Matches")]
        public async Task<ActionResult<IEnumerable<Match>>> GetTournamentMatches(int id)
        {
            try
            {
                var tournament = await _context.Tournaments.FindAsync(id);

                if (tournament == null)
                {
                    return NotFound();
                }

                var matches = await _context.Matches
                .Where(match => match.TournamentId == id)
                .OrderBy(match => match.MatchStart)
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

        // GET: api/Tournaments/5/Participants
        [HttpGet("{id}/Participants")]
        public async Task<ActionResult<IEnumerable<TournamentParticipant>>> GetTournamentParticipants(int id)
        {
            var participants = await _context.TournamentParticipants
            .Where(entry => entry.TournamentId == id)
            .ToListAsync();

            if (participants == null)
            {
                return NotFound();
            }

            return participants;
        }

        // POST: api/Tournaments
        [HttpPost]
        public async Task<ActionResult<Tournament>> CreateTournament(Tournament tournament)
        {
            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTournament), new { id = tournament.TournamentId }, tournament);
        }

        // PUT: api/Tournaments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Tournament tournament)
        {
            var id = tournament.TournamentId;
            _context.Entry(tournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TournamentExists(id))
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

        // DELETE: api/Tournaments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournament(int id)
        {
            var test = await _context.Tournaments.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }

            _context.Tournaments.Remove(test);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TournamentExists(int id)
        {
            return _context.Tournaments.Any(e => e.TournamentId == id);
        }
    }
}
