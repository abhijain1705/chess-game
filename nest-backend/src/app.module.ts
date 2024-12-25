// nestjs import
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// controller
import { AppController } from './app.controller';

// services
import { AppService } from './app.service';

// modules
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

// configuration
import { Configuration } from './config/configuration';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';

// middleware
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb', // MongoDB connection
      url: Configuration.DB_URL, // MongoDB URI from your config
      database: Configuration.DB_NAME, // Database name
      useNewUrlParser: true, // Important for MongoDB compatibility
      useUnifiedTopology: true, // Important for MongoDB compatibility
      entities: [], // Add your entities here once you create them
      synchronize: true, // Set to true for dev environment, false for production
    }),
    MongooseModule.forRoot(Configuration.DB_URL, {
      // DB URL
      dbName: Configuration.DB_NAME, // DB Name
    }),
    AuthModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth');
  }
}
