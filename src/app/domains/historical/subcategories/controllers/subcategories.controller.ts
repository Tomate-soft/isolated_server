import { Controller, Get } from '@nestjs/common';
import { SubcategoriesService } from '../services/subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private subcategoriesService: SubcategoriesService) {}

  @Get('for-command')
  async getSubcategoriesForCommand(): Promise<any[]> {
    return await this.subcategoriesService.getSubcategoriesForCommand();
  }
}
