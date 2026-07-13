import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategoryOne } from 'src/schemas/catalogo/subcategories/subCategoryOne.Schema';

@Injectable()
export class ReadSubcategoriesRepository {
  constructor(
    @InjectModel(SubCategoryOne.name) private subCategoryOneModel: Model<SubCategoryOne>,
  ) {}

  async findAllForCommand(): Promise<SubCategoryOne[]> {
    return await this.subCategoryOneModel.find().lean().select('code name');
  }
}
