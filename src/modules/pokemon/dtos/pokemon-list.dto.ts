export interface Result {
	name: string;
	url: string;
}

export interface PokemonListDto {
	count: number;
	next: string;
	previous?: string;
	results: Result[];
}