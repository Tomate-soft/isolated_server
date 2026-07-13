import { OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Integration } from './integrations/integration';
import { OnEvent } from '@nestjs/event-emitter/dist/decorators/on-event.decorator';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';

// socket-events.ts
export enum SocketEvents {
  CHECKIN_ADDED = 'checkin:register-added',
  WAITLIST_ENTRY_APPROVED = 'waitlist:entry-approved',
  TYPING = 'waitlist:typing',
  CREATE_WAITLIST_ENTRY = 'waitlist:create-entry',
  EDIT_WAITLIST_ENTRY = 'waitlist:edit-entry',
  DELETE_WAITLIST_ENTRY = 'waitlist:delete-entry',
  PAYMENT_TABLE_UPDATED = 'payment:table-updated',
  TABLE_OPENED = 'checkin:table-opened',
}

export interface WaitListTypingPayload {
  registerId: string;
  field: 'name' | 'diners';
  value: string | number;
  user: string; // nombre del usuario que está escribiendo
}

@WebSocketGateway({
  cors: {
    origin: process.env.ENABLE_CI_ORIGINS || '*', // Tu dominio de Next.js
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class BroadcastGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(private readonly integration: Integration) {}
  // PRIMER ACTIVIDAD
  // force
  // Este log se dispara cuando arranca el servidor
  //
  onModuleInit() {
    console.log('--- GATEWAY CONFIG ---');
    console.log('CORS Origin:', process.env.ENABLE_CI_ORIGINS || '*');
    console.log('----------------------');
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('approveWaitlistEntry')
  async approveWaitlistEntry(
    @MessageBody() body: { idempotencyKey: string; tableId: string; diners: number },
  ) {
    const response = await this.integration.approveWaitlistEntry(
      body.idempotencyKey,
      body.tableId,
      body.diners,
    );
    this.server.emit(SocketEvents.WAITLIST_ENTRY_APPROVED, {
      ...body,
      registers: response.registers,
      tables: response.tables,
    });
  }

  @OnEvent(SocketEvents.WAITLIST_ENTRY_APPROVED)
  handleWaitlistEntryApprovedEvent(payload: { registers: CheckInRegister[]; tables: Table[] }) {
    this.server.emit(SocketEvents.WAITLIST_ENTRY_APPROVED, payload);
  }

  //force
  @OnEvent(SocketEvents.CHECKIN_ADDED)
  handleCheckinAddedEvent(payload: CheckInRegister[]) {
    console.log('Received CHECKIN_ADDED event with payload:', payload);
    this.server.emit(SocketEvents.CHECKIN_ADDED, payload);
  }

  @OnEvent(SocketEvents.EDIT_WAITLIST_ENTRY)
  handleEditWaitlistEntryEvent(payload: CheckInRegister[]) {
    this.server.emit(SocketEvents.EDIT_WAITLIST_ENTRY, payload);
  }

  @OnEvent(SocketEvents.DELETE_WAITLIST_ENTRY)
  handleDeleteWaitlistEntryEvent(payload: CheckInRegister[]) {
    this.server.emit(SocketEvents.DELETE_WAITLIST_ENTRY, payload);
  }

  @OnEvent(SocketEvents.TABLE_OPENED)
  async handleTableOpenedEvent(payload: Table) {
    const res = await this.integration.getTablesForCheckin();
    this.server.emit(SocketEvents.TABLE_OPENED, res);
  }

  @SubscribeMessage(SocketEvents.TYPING)
  handleTypingEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: WaitListTypingPayload,
  ) {
    client.broadcast.emit(SocketEvents.TYPING, payload);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    @MessageBody() payload: { message: string },
  ): Promise<string> {
    const res = await this.integration.getTablesForCheckin();
    // SEGUNDA ACTIVIDAD
    // si aqui hacemos una integracion con la base de datos podemos regresar un payload con las mesas actualizadas y estariamos reduciendo a la mitad las peticiones, ya que ahorita se esucha el evento y cada sistema avienta de regreso una peticion a la base de datos, con esto se reduce a una sola peticion a la base de datos y se regresa el payload con las mesas actualizadas, esto es solo un ejemplo pero se puede hacer con cualquier evento que se quiera escuchar y reducir las peticiones a la base de datos

    // hya qu ever si eso esta bien o si mejor aqui solo lanzamos un evento sin payload y cada sistema se encarga de hacer la peticion a la base de datos, esto es solo un ejemplo pero se puede hacer con cualquier evento que se quiera escuchar y reducir las peticiones a la base de datos
    this.server.emit(SocketEvents.PAYMENT_TABLE_UPDATED, res);
    return 'Hello world!';
  }

  // TERCERA ACTIVIDAD
  // hay que estudiar el tema de namespaces. para empezar a modularizar y escalar esto
}
