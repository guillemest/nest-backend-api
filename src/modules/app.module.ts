
import { PokemonModule } from './pokemon/pokemon.module';
import { AppLogger } from './../config/logger/logger.service';
import { Configuration } from './../config/config.enum';
import { AppConfigModule } from '../config/app-config.module';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      isGlobal: true
    }),
    ConfigModule.forRoot(),
    PokemonModule,
    AppConfigModule
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },],
})
export class AppModule {
  static port: number | string;

  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    AppModule.port = this.configService.get(Configuration.PORT);
    this.logger.log(
      `==> RUNNING PORT: ${this.configService.get(Configuration.PORT)}`,
    );
  }
}
