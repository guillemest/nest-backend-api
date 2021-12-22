import { Specy } from './pokemon.dto';

export interface Trigger {
	name: string;
	url: string;
}


export interface Evolution_detail {
	gender?: any;
	held_item?: any;
	item?: any;
	known_move?: any;
	known_move_type?: any;
	location?: any;
	min_affection?: any;
	min_beauty?: any;
	min_happiness?: any;
	min_level: number;
	needs_overworld_rain: boolean;
	party_species?: any;
	party_type?: any;
	relative_physical_stats?: any;
	time_of_day: string;
	trade_species?: any;
	trigger: Trigger;
	turn_upside_down: boolean;
}

export interface Evolves_to {
	evolution_details: Evolution_detail[];
	evolves_to: Evolves_to[];
	is_baby: boolean;
	species: Specy;
}

export interface Chain {
	evolution_details: any[];
	evolves_to: Evolves_to[];
	is_baby: boolean;
	species: Specy;
}

export interface PokemonEvolutionChain {
	baby_trigger_item?: any;
	chain: Chain;
	id: number;
}