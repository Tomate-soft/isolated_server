import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDailyRegisterDto } from 'src/dto/dailyRegister/createDailyregister.dto';
import { UpdateDailyRegisterDto } from 'src/dto/dailyRegister/updateDailyRegister.dto';
import { OperatingPeriodService } from 'src/operating-period/operating-period.service';
import { DailyRegister } from 'src/schemas/dailyRegister/createDailyRegister';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class DailyRegisterService {
  constructor(
    @InjectModel(DailyRegister.name)
    private dailyRegisterModel: Model<DailyRegister>,
    @InjectModel(User.name) // Anotación separada para el modelo User
    private userModel: Model<User>,
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodModel: Model<OperatingPeriod>,
    private operatingPeriodService: OperatingPeriodService,
  ) {}

  async create(body: CreateDailyRegisterDto, isFinger?: boolean) {
    const actuallyUser = await this.userModel
      .findOne({ employeeNumber: body.employeeNumber })
      .populate({
        path: 'dailyRegister',
      });

    if (!actuallyUser) {
      throw new NotFoundException('No se encontro el usuario');
    }
    const isAllow = isFinger
      ? true
      : actuallyUser && body.pinPos === actuallyUser.pinPos
        ? true
        : false;
    if (!isAllow) {
      throw new NotFoundException('Contraseña incorrecta');
    }
    if (isAllow) {
      try {
        if (!actuallyUser.dailyRegister?.firstTime) {
          const currentPeriod = await this.operatingPeriodService.getCurrent();

          const dataRegister = {
            userId: actuallyUser._id,
            firstTime: body.registerInput,
          };
          const newRegister = new this.dailyRegisterModel(dataRegister);
          const registerEntry = await newRegister.save();
          const updateUser = await this.userModel.findByIdAndUpdate(actuallyUser._id, {
            dailyRegister: registerEntry._id,
          });
          if (!updateUser) {
            throw new NotFoundException('No se pudo actualizar el usuario');
          }
          await this.injectInOperatingPeriod(registerEntry._id.toString());
          return {
            username: `${actuallyUser.name} ${actuallyUser.lastName}`,
            registerData: registerEntry,
          };
        }

        if (!actuallyUser.dailyRegister.secondTime) {
          const dataDate = body.registerInput;
          const dataRegister = {
            userId: actuallyUser._id,
            secondTime: dataDate,
          };
          const updatedRegister = await this.dailyRegisterModel.findByIdAndUpdate(
            actuallyUser.dailyRegister,
            dataRegister,
            { new: true },
          );

          return {
            username: `${actuallyUser.name} ${actuallyUser.lastName}`,
            registerData: updatedRegister,
          };
        }
        if (!actuallyUser.dailyRegister.thirdTime) {
          const dataDate = body.registerInput;
          const dataRegister = {
            userId: actuallyUser._id,
            thirdTime: dataDate,
          };
          const updatedRegister = await this.dailyRegisterModel.findByIdAndUpdate(
            actuallyUser.dailyRegister,
            dataRegister,
            { new: true },
          );
          if (!updatedRegister) {
            throw new NotFoundException('No se pudo actualizar el registro');
          }
          return {
            username: `${actuallyUser.name} ${actuallyUser.lastName}`,
            registerData: updatedRegister,
          };
        }
        if (!actuallyUser.dailyRegister.fourthTime) {
          const dataDate = body.registerInput;
          const dataRegister = {
            userId: actuallyUser._id,
            fourthTime: dataDate,
          };
          const updatedRegister = await this.dailyRegisterModel.findByIdAndUpdate(
            actuallyUser.dailyRegister,
            dataRegister,
            { new: true },
          );
          if (!updatedRegister) {
            throw new NotFoundException('No se pudo actualizar el registro');
          }
          return {
            username: `${actuallyUser.name} ${actuallyUser.lastName}`,
            registerData: updatedRegister,
          };
        }
        if (actuallyUser.dailyRegister.fourthTime) {
          const res = {
            username: `${actuallyUser.name} ${actuallyUser.lastName}`,
            registerData: actuallyUser.dailyRegister,
          };
          return res;
        }
      } catch (error) {
        throw new NotFoundException(`Error al procesar la solicitud: ${error.message} ${error}`);
      }
    }
  }

  async updateRegister(id: string, update: UpdateDailyRegisterDto) {
    const session = await this.dailyRegisterModel.startSession();
    const updateRegister = await session.withTransaction(async () => {
      const updateRegister = await this.dailyRegisterModel.findByIdAndUpdate(id, update, {
        new: true,
      });
      return updateRegister;
    });
    await session.commitTransaction();
    return updateRegister;
  }

  async getAll() {
    try {
      const allRegister = await this.dailyRegisterModel.find().populate({
        path: 'userId',
      });
      return allRegister;
    } catch (error) {
      throw new NotFoundException('Ha ocurrido algo inesperado');
    }
  }

  private async injectInOperatingPeriod(dailyRegisterId: string) {
    // 1. Obtener el ID del periodo de operación actual
    const currentPeriod = await this.operatingPeriodService.getCurrent();
    const currentPeriodId = currentPeriod[0]._id;

    // 2. Si el ID existe, intentar la actualización
    if (currentPeriod && currentPeriodId) {
      try {
        // 3. Realizar la actualización atómica en la base de datos
        const updatedPeriod = await this.operatingPeriodModel.findByIdAndUpdate(
          currentPeriodId,
          {
            $addToSet: { dailyRegisters: dailyRegisterId },
          },
          { new: true },
        );
        // 4. Manejar la respuesta exitosa
        if (updatedPeriod) {
          console.info('TODO SALIO BIEN');
          console.log(updatedPeriod);
        } else {
          console.warn('El periodo de operación no fue encontrado.');
        }
      } catch (err) {
        // 5. Capturar y manejar cualquier error
        console.error('Error al actualizar el periodo:', err);
      }
    } else {
      console.warn('No se pudo obtener el ID del periodo de operación actual.');
    }
  }
}
