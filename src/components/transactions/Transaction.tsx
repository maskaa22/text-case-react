import React, { useState } from "react";
import Papa from "papaparse";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TransactionDate } from "../../interface";
import axios from "axios";
import ModalWindow from "./../modal/ModalWindow";
import { Button, Input, Select } from "@chakra-ui/react";
import TableComponent from "../table/TableComponent";
import "./transaction.css";

const Transaction = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [searchClientName, setSearchClientName] = useState<string>("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>("");
  const [selectedFilterType, setSelectedFilterType] = useState<string>("");
  const [transactionId, setTransactionId] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [flag, setFlag] = useState<string>("");

  const itemsPerPage = 10;

  const addTransaction = async (transactionData: TransactionDate) => {
    await axios.post("http://localhost:3000/addTransaction", transactionData);
  };

  const getAllTransactions = async (
    page: number,
    sortBy: string,
    sortOrder: string,
    searchClientName: string,
    status: string,
    type: string
  ) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/getAllTransactions?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchClientName=${searchClientName}&status=${status}&type=${type}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTransactionsForExport = async (
    sortBy: string,
    sortOrder: string,
    searchClientName: string,
    status: string,
    type: string
  ) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/getAllTransactionsForExport?&sortBy=${sortBy}&sortOrder=${sortOrder}&searchClientName=${searchClientName}&status=${status}&type=${type}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const mutation = useMutation(addTransaction, {
    onSuccess: () => queryClient.invalidateQueries("transactions"),
  });

  const { data, isLoading, isError } = useQuery(
    [
      "transactions",
      currentPage,
      sortBy,
      sortOrder,
      searchClientName,
      selectedFilterStatus,
      selectedFilterType,
    ],
    () =>
      getAllTransactions(
        currentPage,
        sortBy,
        sortOrder,
        searchClientName,
        selectedFilterStatus,
        selectedFilterType
      ),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const transactions = data && data.transactions ? data.transactions : [];

  if (isLoading) {
    return <div>Loading.....</div>;
  }
  if (isError) {
    return <div>Error fetching transaction</div>;
  }

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvText = reader.result?.toString();
        if (csvText) {
          const parsedData = Papa.parse(csvText, { header: true }).data;
          mutation.mutate(parsedData, {
            onSuccess: () => queryClient.invalidateQueries("transactions"),
          });
        }
      };
    }
  };

  //changing transaction pages
  const handlerPageChange = (newPage: number) => {
    setCurrentPage(newPage);
    queryClient.invalidateQueries("transactions");
  };
  //sorting data by columns
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setCurrentPage(1);
    queryClient.invalidateQueries("transactions");
  };
  //search by client name column
  const handlerSearchClientNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchClientName(e.target.value);
    setCurrentPage(1);
    queryClient.invalidateQueries("transactions");
  };
  //filter by status
  const handleFilterChangeStatus = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFilterStatus(e.target.value);
    setCurrentPage(1);
    queryClient.invalidateQueries("transactions");
  };
  //filter by type
  const handleFilterChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilterType(e.target.value);
    setCurrentPage(1);
    queryClient.invalidateQueries("transactions");
  };
  //edit status
  const handleStatus = (id: number) => {
    setTransactionId(id);
    setIsOpen(true);
  };
  //close modal
  const onClose = () => {
    setIsOpen(false);
  };

  //export data
  const exportToCSV = async (
    sortBy: string,
    sortOrder: string,
    searchClientName: string,
    status: string,
    type: string
  ) => {
    const response = await getAllTransactionsForExport(
      sortBy,
      sortOrder,
      searchClientName,
      status,
      type
    );

    const csvData = Papa.unparse(response.rows);

    const blob = new Blob([csvData], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="container-data">
      <div className="flex-between">
        <div className="flex-inline">
          <Select
            className="status"
            value={selectedFilterStatus}
            onChange={handleFilterChangeStatus}
          >
            <option value={""}>All</option>
            <option value={"Pending"}>Pending</option>
            <option value={"Completed"}>Completed</option>
            <option value={"Cancelled"}>Cancelled</option>
          </Select>

          <Select
            className="type"
            value={selectedFilterType}
            onChange={handleFilterChangeType}
          >
            <option value={""}>All</option>
            <option value={"Refill"}>Refill</option>
            <option value={"Withdrawal"}>Withdrawal</option>
          </Select>
        </div>
        <div>
          <Input
            type="file"
            id="fileInput"
            className="custom-file-input"
            accept=".csv"
            onChange={(e) => handleFileDrop(e)}
          />
          <label htmlFor="fileInput" className="custom-file-label">
            IMPORT
          </label>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={() =>
              exportToCSV(
                sortBy,
                sortOrder,
                searchClientName,
                selectedFilterStatus,
                selectedFilterType
              )
            }
          >
            EXPORT
          </Button>
        </div>
      </div>

      {transactions && transactions.length > 0 && (
        <div>
          <Input
            type="text"
            placeholder="search by name client"
            value={searchClientName}
            onChange={(e) => handlerSearchClientNameChange(e)}
          />
          <TableComponent
            transactions={transactions}
            data={data}
            itemsPerPage={itemsPerPage}
            handleStatus={handleStatus}
            handlerPageChange={handlerPageChange}
            currentPage={currentPage}
            handleSort={handleSort}
            setFlag={setFlag}
          />
        </div>
      )}

      <ModalWindow
        isOpen={isOpen}
        onClose={onClose}
        id={transactionId}
        flag={flag}
      />
    </div>
  );
};

export default Transaction;
