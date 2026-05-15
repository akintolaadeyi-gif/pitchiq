export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strLeague: string;
  strStadium: string;
  strCountry: string;
  strDescriptionEN: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  strPosition: string;
  strNationality: string;
  strThumb: string;
  strDescriptionEN: string;
  dateBorn: string;
}

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
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strStatus?: string;
  strVenue?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strCountry: string;
  strBadge?: string;
  strLogo?: string;
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
