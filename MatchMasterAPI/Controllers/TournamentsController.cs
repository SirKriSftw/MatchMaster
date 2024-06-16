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
        public async Task<ActionResult<IEnumerable<Match>>> GetAllTournamentMatches(int id)
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

        // GET: api/Tournaments/5/Matches/2
        [HttpGet("{id}/Matches/{num}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetSomeUpcomingTournamentMatches(int id, int num)
        {
            try
            {
                var tournament = await _context.Tournaments.FindAsync(id);

                if (tournament == null)
                {
                    return NotFound();
                }
                var currTime = DateTime.UtcNow;
                var matches = await _context.Matches
                .Where(match => match.TournamentId == id && match.MatchStart > currTime)
                .OrderBy(match => match.MatchStart)
                .Take(num)
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

        // GET: api/Tournaments/5/Matches/Group
        [HttpGet("{id}/Matches/Group")]
        public async Task<ActionResult<Dictionary<int, List<Match>>>> GetTournamentMatchesGrouped(int id)
        {
            var tournament = await _context.Tournaments.FindAsync(id);
        
            if (tournament == null)
            {
                return NotFound();
            }

            List<Match> matches = await _context.Matches
                .Where(match => match.TournamentId == id)
                .ToListAsync();

            Dictionary<int, List<Match>> groupedMatches = new Dictionary<int, List<Match>>();
            List<Match> startingMatches = matches
                .Where(match => match.PrevMatch == null || match.PrevMatch == 0)
                .OrderBy(match => match.MatchStart)
                .ToList();

            int currentLevel = 1;
            groupedMatches[currentLevel] = startingMatches; 
            List<Match> currentMatches = startingMatches;
            HashSet<int> alreadyAddedMatches = new HashSet<int>();

            while (currentMatches.Any())
            {
                currentLevel++;
                List<Match> nextMatches = new List<Match>();
                foreach (var match in currentMatches)
                {
                    if (match.NextMatch.HasValue && match.NextMatch != 0 && !alreadyAddedMatches.Contains(match.NextMatch.Value))
                    {
                        var nextMatch = matches.Where(m => m.MatchId == match.NextMatch).FirstOrDefault();
                        if(nextMatch != null)
                        {
                            nextMatches.Add(nextMatch);
                            alreadyAddedMatches.Add(match.NextMatch.Value);
                        }                        
                    }
                }
                
                if(nextMatches.Count >= 1)
                {
                    groupedMatches[currentLevel] = nextMatches;
                }                
                currentMatches = nextMatches;
            }

            return groupedMatches;
        }

        // GET: api/Tournaments/5/Participants
        [HttpGet("{id}/Participants")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTournamentParticipants(int id)
        {
            var participants = await _context.TournamentParticipants
            .Where(entry => entry.TournamentId == id)
            .Join(
                _context.Users,
                entry => entry.UserId,
                user => user.UserId,
                (entry, user) => new UserDto {UserId = user.UserId, Username = user.Username, Email = user.Email}
            )
            .OrderBy(users => users.Username)
            .ToListAsync();

            if (participants == null || participants.Count == 0)
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
            var tournament = await _context.Tournaments.FindAsync(id);
            if (tournament == null)
            {
                return NotFound();
            }

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TournamentExists(int id)
        {
            return _context.Tournaments.Any(e => e.TournamentId == id);
        }

        // DELETE: api/Tournaments/5/Participant/1
        [HttpDelete("{id}/Participant/{userId}")]
        public async Task<IActionResult> DeleteTournamentParticipant(int id, int userId)
        {
            var participant = await _context.TournamentParticipants
                .Where(p => p.TournamentId == id && p.UserId == userId)
                .FirstOrDefaultAsync();

            if (participant == null)
            {
                return NotFound();
            }

            _context.TournamentParticipants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
