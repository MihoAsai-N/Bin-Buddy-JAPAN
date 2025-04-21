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
    paymentStatus: "paid" | "unpaid";
    lastLogin: string;
    note?: string;
  }
  