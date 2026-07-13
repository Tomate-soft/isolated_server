import { EmailMessage } from '../../application/EmailMessage';

export interface EmailService {
  send(notification: EmailMessage): Promise<void>;
}
