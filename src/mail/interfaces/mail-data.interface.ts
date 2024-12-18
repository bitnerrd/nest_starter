export interface MailData<T = never> {
  to: string;
  name?: string;
  data: T;
}
