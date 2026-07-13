import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modifier } from 'src/schemas/catalogo/modifiers.Schema';

@Injectable()
export class ReadModifiers {
  constructor(@InjectModel(Modifier.name) private readonly modifierModel: Model<Modifier>) {}

  async findAllForSales(): Promise<any[]> {
    // Implementation to read all modifiers from the database
    return [];
  }
}
