import { AppConfigModule } from './../../config/app-config.module';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [AppConfigModule],
    controllers: [PokemonController],
    providers: [PokemonService],
})
export class PokemonModule { }
