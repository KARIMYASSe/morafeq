import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { LocationInsightsModule } from './../location-insights/location-insights.module';
import { AreasModule } from '../areas/areas.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [UploadsModule,AreasModule,LocationInsightsModule,ReviewsModule,AiModule],
providers: [ListingsService],
  controllers: [ListingsController],
  exports: [ListingsService],
})
export class ListingsModule {}
