import { Injectable } from '@nestjs/common';
import { ReadDataRepository } from 'src/app/data/data-read.repository';

@Injectable()
export class SubcategoriesIntegrationsService {
  constructor(private readRepository: ReadDataRepository) {}

  async getSubcategorisForCommand(): Promise<any[]> {
    const subcategories = await this.readRepository.readSubcategoriesRepository.findAllForCommand();
    return subcategories;
  }
}
