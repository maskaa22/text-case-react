
export interface TransactionDate {
  TransactionId: number;
  Status: string;
  Type: string;
  ClientName: string;
  Amount: string;
}
export interface ModalInterface {
  isOpen: boolean,
  onClose: () => void,
  id: number
}