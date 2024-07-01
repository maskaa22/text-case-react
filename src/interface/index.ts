
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
  id: number,
  flag: string
}

export interface Data {
  totalCount: number,
  transactions: TransactionDate[]
}

export interface TableData {
  transactions: TransactionDate[],
  data: Data,
  itemsPerPage: number,
  handleStatus: (id: number) => void,
  handlerPageChange: (page: number) => void,
  currentPage: number,
  handleSort: (sort: string) => void,
  setFlag: (flag: string) => void,
}

export interface LoginFormProps {
  username: string;
  password: string;
}