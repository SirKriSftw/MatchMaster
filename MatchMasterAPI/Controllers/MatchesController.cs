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

        // POST: api/Matches
        [HttpPost]
        public async Task<ActionResult<Match>> PostMatch(Match match)
        {
            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMatch), new { id = match.MatchId }, match);
        }

        // PUT: api/Matches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatch(int id, Match match)
        {
            if (id != match.MatchId)
            {
                return BadRequest();
            }

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

        private bool MatchExists(int id)
        {
            return _context.Matches.Any(e => e.MatchId == id);
        }
    }
}