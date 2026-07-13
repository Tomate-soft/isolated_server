import { Email } from './Email.vo';

export interface EmailMessage {
  to: Email;
  message: string;
  sent: Date;
}
