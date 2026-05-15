export interface Event {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strTime: string;
  strLeague: string;
  strSport: string;
  strStatus?: string;
  strVenue?: string;
  homeLogo?: string;
  awayLogo?: string;
  elapsed?: number | null;
}

export interface Standing {
  idStanding: string;
  intRank: string;
  strTeam: string;
  strTeamBadge: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intPoints: string;
}

function fmt(d: Date) {
  return d.toISOString().split('T')[0];
}

async function sportsGet(sport: string, path: string, params: string) {
  try {
    const res = await fetch(
      '/api/sports?sport=' + sport + '&path=' + path + '&params=' + encodeURIComponent(params),
      { next: { revalidate: 60 } }
    );
    return res.json();
  } catch {
    return {};
  }
}

function mapFixture(f: any, leagueName: string): Event {
  const date = f.fixture?.date ? new Date(f.fixture.date) : null;
  const status = f.fixture?.status?.short ?? '';
  const isLive = ['1H','HT','2H','ET','BT','P','SUSP','INT','LIVE'].includes(status);
  const isFinished = ['FT','AET','PEN'].includes(status);
  return {
    idEvent: String(f.fixture?.id ?? Math.random()),
    strEvent: (f.teams?.home?.name ?? '') + ' vs ' + (f.teams?.away?.name ?? ''),
    strHomeTeam: f.teams?.home?.name ?? '',
    strAwayTeam: f.teams?.away?.name ?? '',
    intHomeScore: f.goals?.home != null ? String(f.goals.home) : null,
    intAwayScore: f.goals?.away != null ? String(f.goals.away) : null,
    dateEvent: date ? fmt(date) : '',
    strTime: date ? date.toTimeString().slice(0, 5) : '',
    strLeague: leagueName,
    strSport: 'football',
    strStatus: status,
    strVenue: f.fixture?.venue?.name ?? '',
    homeLogo: f.teams?.home?.logo ?? '',
    awayLogo: f.teams?.away?.logo ?? '',
    elapsed: isLive ? (f.fixture?.status?.elapsed ?? null) : null,
  };
}

function mapBasketball(g: any, league: string): Event {
  const date = g.date ? new Date(g.date) : null;
  return {
    idEvent: String(g.id ?? Math.random()),
    strEvent: (g.teams?.home?.name ?? '') + ' vs ' + (g.teams?.away?.name ?? ''),
    strHomeTeam: g.teams?.home?.name ?? '',
    strAwayTeam: g.teams?.away?.name ?? '',
    intHomeScore: g.scores?.home?.total != null ? String(g.scores.home.total) : null,
    intAwayScore: g.scores?.away?.total != null ? String(g.scores.away.total) : null,
    dateEvent: date ? fmt(date) : '',
    strTime: g.time ?? '',
    strLeague: league,
    strSport: 'basketball',
    strStatus: g.status?.short ?? '',
    strVenue: g.venue ?? '',
  };
}

// LEAGUE IDs for api-sports football
export const LEAGUES = {
  premierLeague:   { id: '39',  name: 'Premier League',  season: '2024', sport: 'football' },
  laLiga:          { id: '140', name: 'La Liga',          season: '2024', sport: 'football' },
  championsLeague: { id: '2',   name: 'Champions League', season: '2024', sport: 'football' },
  bundesliga:      { id: '78',  name: 'Bundesliga',       season: '2024', sport: 'football' },
  serieA:          { id: '135', name: 'Serie A',          season: '2024', sport: 'football' },
  nba:             { id: '12',  name: 'NBA',              season: '2024-2025', sport: 'basketball' },
}

export async function getLiveMatches(): Promise<Event[]> {
  try {
    const data = await sportsGet('football', 'fixtures', 'live=all');
    return (data.response ?? []).map((f: any) =>
      mapFixture(f, f.league?.name ?? 'Football')
    );
  } catch {
    return [];
  }
}

export async function getLastEvents(leagueId: string, leagueName: string, season = '2024', sport = 'football'): Promise<Event[]> {
  try {
    if (sport === 'basketball') {
      const now = new Date();
      const from = new Date(now); from.setDate(now.getDate() - 14);
      const data = await sportsGet('basketball', 'games', 'league=' + leagueId + '&season=' + season + '&date=' + fmt(from));
      const all: any[] = data.response ?? [];
      return all.filter(g => g.status?.short === 'FT').slice(-10).reverse().map(g => mapBasketball(g, leagueName));
    }
    const now = new Date();
    const from = new Date(now); from.setDate(now.getDate() - 14);
    const data = await sportsGet('football', 'fixtures', 'league=' + leagueId + '&season=' + season + '&status=FT&from=' + fmt(from) + '&to=' + fmt(now));
    return (data.response ?? []).slice(-10).reverse().map((f: any) => mapFixture(f, leagueName));
  } catch {
    return [];
  }
}

export async function getNextEvents(leagueId: string, leagueName: string, season = '2024', sport = 'football'): Promise<Event[]> {
  try {
    if (sport === 'basketball') {
      const now = new Date();
      const to = new Date(now); to.setDate(now.getDate() + 14);
      const data = await sportsGet('basketball', 'games', 'league=' + leagueId + '&season=' + season + '&date=' + fmt(to));
      const all: any[] = data.response ?? [];
      return all.filter(g => g.status?.short === 'NS').slice(0, 10).map(g => mapBasketball(g, leagueName));
    }
    const now = new Date();
    const to = new Date(now); to.setDate(now.getDate() + 14);
    const data = await sportsGet('football', 'fixtures', 'league=' + leagueId + '&season=' + season + '&status=NS&from=' + fmt(now) + '&to=' + fmt(to));
    return (data.response ?? []).slice(0, 10).map((f: any) => mapFixture(f, leagueName));
  } catch {
    return [];
  }
}

export async function getLeagueTable(leagueId: string, season = '2024', sport = 'football'): Promise<Standing[]> {
  try {
    if (sport === 'basketball') {
      const data = await sportsGet('basketball', 'standings', 'league=' + leagueId + '&season=' + season);
      const table = data.response?.[0]?.league?.standings?.[0] ?? [];
      return table.map((t: any, i: number) => ({
        idStanding: String(i),
        intRank: String(t.rank ?? i + 1),
        strTeam: t.team?.name ?? '',
        strTeamBadge: t.team?.logo ?? '',
        intPlayed: String(t.games?.played ?? 0),
        intWin: String(t.games?.win?.total ?? 0),
        intDraw: '0',
        intLoss: String(t.games?.lose?.total ?? 0),
        intGoalsFor: String(t.points?.for ?? 0),
        intGoalsAgainst: String(t.points?.against ?? 0),
        intPoints: String(t.points?.for ?? 0),
      }));
    }
    const data = await sportsGet('football', 'standings', 'league=' + leagueId + '&season=' + season);
    const table = data.response?.[0]?.league?.standings?.[0] ?? [];
    return table.map((t: any) => ({
      idStanding: String(t.rank),
      intRank: String(t.rank),
      strTeam: t.team?.name ?? '',
      strTeamBadge: t.team?.logo ?? '',
      intPlayed: String(t.all?.played ?? 0),
      intWin: String(t.all?.win ?? 0),
      intDraw: String(t.all?.draw ?? 0),
      intLoss: String(t.all?.lose ?? 0),
      intGoalsFor: String(t.all?.goals?.for ?? 0),
      intGoalsAgainst: String(t.all?.goals?.against ?? 0),
      intPoints: String(t.points ?? 0),
    }));
  } catch {
    return [];
  }
}

export async function searchTeam(name: string) { return []; }
export async function getTeamPlayers(teamId: string) { return []; }

export async function getBDLGames(finished: boolean): Promise<Event[]> {
  try {
    const now = new Date();
    const from = new Date(now); from.setDate(now.getDate() - (finished ? 14 : 0));
    const to = new Date(now); to.setDate(now.getDate() + (finished ? 0 : 14));
    const res = await fetch(
      '/api/basketball?path=games&query=' + encodeURIComponent(
        'per_page=10&seasons[]=2024&start_date=' + fmt(finished ? from : to) + '&end_date=' + fmt(to)
      )
    );
    const data = await res.json();
    return (data.data ?? []).map((g: any) => ({
      idEvent: String(g.id),
      strEvent: g.home_team?.full_name + ' vs ' + g.visitor_team?.full_name,
      strHomeTeam: g.home_team?.abbreviation ?? g.home_team?.full_name ?? '',
      strAwayTeam: g.visitor_team?.abbreviation ?? g.visitor_team?.full_name ?? '',
      intHomeScore: g.home_team_score ? String(g.home_team_score) : null,
      intAwayScore: g.visitor_team_score ? String(g.visitor_team_score) : null,
      dateEvent: g.date ? g.date.split('T')[0] : '',
      strTime: g.status ?? '',
      strLeague: 'NBA',
      strSport: 'basketball',
      strStatus: g.status ?? '',
      strVenue: '',
    }));
  } catch {
    return [];
  }
}
