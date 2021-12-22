import { PokemonBasicDataDto } from "./pokemon-basic-data.dto";

export interface PokemonPaginationInfoDto {
    limit: number;
    count: number;    
    next: number;
    previous: number;
    data: PokemonBasicDataDto[]
}