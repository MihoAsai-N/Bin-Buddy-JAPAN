export type PaymentStatus = "paid" | "unpaid";

export interface AdminInfo {
  municipalityCode: string;
  municipalityName: string;
  furigana: string;
  postalCode: string;
  address: string;
  department: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  paymentStatus: PaymentStatus;
  lastLogin: string;
  paymentDate?: string;
  note?: string;
}
