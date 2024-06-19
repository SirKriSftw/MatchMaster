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
    public class MatchesController : ControllerBase
    {
        private readonly MatchMasterContext _context;

        public MatchesController(MatchMasterContext context)
        {
            _context = context;
        }

        // GET: api/Matches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            return await _context.Matches.ToListAsync();
        }

        // GET: api/Matches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Match>> GetMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);

            if (match == null)
            {
                return NotFound();
            }

            return match;
        }

        // GET: api/Matches/5/Participants
        [HttpGet("{id}/Participants")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetMatchParticipants(int id)
        {
            var participants = await _context.MatchParticipants
            .Where(entry => entry.MatchId == id)
            .Join(
                _context.Users,
                entry => entry.UserId,
                user => user.UserId,
                (entry, user) => new UserDto {UserId = user.UserId, Username = user.Username, Email = user.Email}
            )
            .ToListAsync();

            if (participants == null || participants.Count == 0)
            {
                return NotFound();
            }

            return participants;
        }


        // POST: api/Matches
        [HttpPost]
        public async Task<ActionResult<Match>> NewMatch(Match match)
        {
            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            if(match.PrevMatch != null || match.PrevMatch != 0)
            {
                var prevMatch = await _context.Matches
                .Where(m => m.MatchId == match.PrevMatch)
                .FirstOrDefaultAsync();
                prevMatch.NextMatch = match.MatchId;
                _context.Entry(match).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetMatch), new { id = match.MatchId }, match);
        }

        // POST: api/Matches/1/Participant/1
        [HttpPost("{id}/Participant/{userId}")]
        public async Task<ActionResult<Match>> NewMatchParticipant(int id, int userId)
        {
            var participant = new MatchParticipant
            {
                MatchId = id,
                UserId = userId
            };

            _context.MatchParticipants.Add(participant);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // PUT: api/Matches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditMatch(Match match)
        {
            var id = match.MatchId;
            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
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

        // PUT: api/Matches/5/Participants
        [HttpPut("{id}/Participant/{userId}/{newUserId}")]
        public async Task<IActionResult> EditMatchParticipant(int id, int userId, int newUserId)
        {
            var participantToEdit = await _context.MatchParticipants
                .Where(p => p.MatchId == id && p.UserId == userId)
                .FirstOrDefaultAsync();    
            participantToEdit.UserId = newUserId;            
            _context.Entry(participantToEdit).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!MatchParticipantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }


        // DELETE: api/Matches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound();
            }

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        // DELETE: api/Matches/5/Participant/1
        [HttpDelete("{id}/Participant/{userId}")]
        public async Task<IActionResult> DeleteMatchParticipant(int id, int userId)
        {
            var participant = await _context.MatchParticipants
                .Where(p => p.MatchId == id & p.UserId == userId)
                .FirstOrDefaultAsync();

            if (participant == null)
            {
                return NotFound();
            }

            _context.MatchParticipants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MatchExists(int? id)
        {
            return _context.Matches.Any(e => e.MatchId == id);
        }

        private bool MatchParticipantExists(int id)
        {
            return _context.MatchParticipants.Any(e => e.MatchId == id);
        }
    }
}
