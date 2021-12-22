import { CacheInterceptor, CacheTTL, Controller, DefaultValuePipe, Get, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PokemonDto, PokemonEvolutionChain, PokemonPaginationInfoDto, PokemonSpeciesDto } from './dtos';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@ApiTags('Pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get('/:idOrName')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Retorna un pokemon.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found.',
    })
    getPokemonByIdName(@Param('idOrName') idOrName: string): Observable<PokemonDto> {
        const param = !isNaN(+idOrName) ? +idOrName : idOrName;
        return this.pokemonService.getPokemonByIdName(param);
    }

    @Get('species/:idOrName')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Retorna un pokemon.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found.',
    })
    getPokemonSpecies(@Param('idOrName') idOrName: string): Observable<PokemonSpeciesDto> {
        const param = !isNaN(+idOrName) ? +idOrName : idOrName;
        return this.pokemonService.getPokemonSpecies(param);
    }

    @Get('evolution-chain/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Retorna la evolución del pokemon.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found.',
    })
    getPokemonEvolutionChain(@Param('id') id: number): Observable<PokemonEvolutionChain> {
        return this.pokemonService.getPokemonEvolutionChain(id);
    }

    @Get('/data/basic')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Retorna todo los pokemons con su información básica.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found.',
    })
    @ApiQuery({
        name: "offset",
        type: Number,
        description: "Optional",
        required: false
    })
    @ApiQuery({
        name: "limit",
        type: Number,
        description: "Optional",
        required: false,
    })
    resolveGetPokemonBasicDataDto(
        @Query('offset', new DefaultValuePipe(0))
        offset: number,
        @Query('limit', new DefaultValuePipe(20))
        limit: number,
    ): Promise<PokemonPaginationInfoDto> {
        return this.pokemonService.getAllPokemons(+offset, +limit);
    }

    @Get('data/detail/:name')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Retorna el detalle del pokemon.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found.',
    })
    getPokemonDetailData(@Param('name') name: string): Promise<any> {
        return this.pokemonService.getPokemonDetailData(name);
    }
}
