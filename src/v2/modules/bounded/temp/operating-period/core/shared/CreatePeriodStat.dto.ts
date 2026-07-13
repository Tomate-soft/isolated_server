export type APPROVED_PERIOD = 'APPROVED';

export interface CreatePeriodStatDomainDto {
  id?: string;
  state: string;
  descript: string;
}
