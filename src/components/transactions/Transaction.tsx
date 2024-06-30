import React, { useState } from "react";
import Papa from "papaparse";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TransactionDate } from "../../interface";
import axios from "axios";

const Transaction = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [searchClientName, setSearchClientName] = useState<string>("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>("");
  const [selectedFilterType, setSelectedFilterType] = useState<string>("");

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
      console.log(error)
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

  return (
    <>
      <select
        className="status"
        value={selectedFilterStatus}
        onChange={handleFilterChangeStatus}
      >
        <option value={""}>All</option>
        <option value={"Pending"}>Pending</option>
        <option value={"Completed"}>Completed</option>
        <option value={"Cancelled"}>Cancelled</option>
      </select>

      <select
        className="type"
        value={selectedFilterType}
        onChange={handleFilterChangeType}
      >
        <option value={""}>All</option>
        <option value={"Refill"}>Refill</option>
        <option value={"Withdrawal"}>Withdrawal</option>
      </select>

      <input type="file" accept=".csv" onChange={(e) => handleFileDrop(e)} />
      {transactions && transactions.length > 0 && (
        <div>
          <input
            type="text"
            placeholder="search by name client"
            value={searchClientName}
            onChange={(e) => handlerSearchClientNameChange(e)}
          />
         
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("TransactionId")}>
                    Transaction Id
                  </th>
                  <th onClick={() => handleSort("Status")}>Status</th>
                  <th onClick={() => handleSort("Type")}>Type</th>
                  <th onClick={() => handleSort("ClientName")}>Client Name</th>
                  <th onClick={() => handleSort("Amount")}>Amount</th>
                  <th onClick={() => handleSort("Action")}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((transaction: TransactionDate) => (
                  <tr key={transaction.TransactionId}>
                    <td>{transaction.TransactionId}</td>
                    <td>{transaction.Status}</td>
                    <td>{transaction.Type}</td>
                    <td>{transaction.ClientName}</td>
                    <td>{transaction.Amount}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          <div>
            {Array.from(
              { length: Math.ceil(data.totalCount / itemsPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlerPageChange(index + 1)}
                  style={{
                    fontWeight: currentPage === index + 1 ? "bold" : "normal",
                    border:
                      currentPage === index + 1 ? "2px solid blue" : "none",
                  }}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Transaction;