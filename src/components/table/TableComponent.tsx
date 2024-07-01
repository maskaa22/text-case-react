import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import "./table.css";
import { TableData } from "../../interface";

function TableComponent({
  transactions,
  data,
  itemsPerPage,
  handleStatus,
  handlerPageChange,
  currentPage,
  handleSort,
  setFlag,
}: TableData) {
  const handleButton = (id: number, flag: string) => {
    handleStatus(id);
    setFlag(flag);
  };

  return (
    <>
      <TableContainer className="transactions">
        <Table variant="striped" colorScheme="gray" size="sl">
          <Thead>
            <Tr style={{ height: "40px" }}>
              <Th
                style={{
                  textAlign: "center",
                  border: "2px solid #bee3f8",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("TransactionId")}
              >
                Id
              </Th>
              <Th
                style={{
                  textAlign: "center",
                  border: "2px solid #bee3f8",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("Status")}
              >
                Status
              </Th>
              <Th
                style={{
                  textAlign: "center",
                  border: "2px solid #bee3f8",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("Type")}
              >
                Type
              </Th>
              <Th
                style={{
                  textAlign: "center",
                  border: "2px solid #bee3f8",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("ClientName")}
              >
                ClientName
              </Th>
              <Th
                style={{
                  textAlign: "center",
                  border: "2px solid #bee3f8",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("Amount")}
              >
                Amount
              </Th>
              <Th style={{ textAlign: "center", border: "2px solid #bee3f8" }}>
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions?.map((transaction) => (
              <Tr key={transaction.TransactionId}>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  {transaction.TransactionId}
                </Td>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  {transaction.Status}
                </Td>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  {transaction.Type}
                </Td>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  {transaction.ClientName}
                </Td>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  {transaction.Amount}
                </Td>
                <Td
                  style={{ textAlign: "center", border: "2px solid #bee3f8" }}
                >
                  <Button
                    style={{ marginRight: "5px" }}
                    colorScheme="blue"
                    onClick={() =>
                      handleButton(transaction.TransactionId, "edit")
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={() =>
                      handleButton(transaction.TransactionId, "delete")
                    }
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {Array.from(
          { length: Math.ceil(data.totalCount / itemsPerPage) },
          (_, index) => (
            <Button
              className="padding-button"
              key={index + 1}
              onClick={() => handlerPageChange(index + 1)}
              style={{
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
                border:
                  currentPage === index + 1 ? "2px solid #3182ce" : "none",
                margin: "0 5px",
              }}
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
    </>
  );
}
export default TableComponent;
