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

function TableComponent({
  transactions,
  data,
  itemsPerPage,
  handleStatus,
  handlerPageChange,
  currentPage,
  handleSort,
  setFlag,
}) {

const handleButton = (id: number, flag: string) => {
  handleStatus(id);
  setFlag(flag);
}

  return (
    <>
      <TableContainer className="transactions">
        <Table variant="striped" colorScheme="blue" size="sm">
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("TransactionId")}>Id</Th>
              <Th onClick={() => handleSort("Status")}>Status</Th>
              <Th onClick={() => handleSort("Type")}>Type</Th>
              <Th onClick={() => handleSort("ClientName")}>ClientName</Th>
              <Th onClick={() => handleSort("Amount")}>Amount</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions?.map((transaction) => (
              <Tr key={transaction.TransactionId}>
                <Td>{transaction.TransactionId}</Td>
                <Td>{transaction.Status}</Td>
                <Td>{transaction.Type}</Td>
                <Td>{transaction.ClientName}</Td>
                <Td>{transaction.Amount}</Td>
                <Td>
                  <Button
                    onClick={() => handleButton(transaction.TransactionId, 'edit')}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => handleButton(transaction.TransactionId, 'delete')}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <div>
        {Array.from(
          { length: Math.ceil(data.totalCount / itemsPerPage) },
          (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlerPageChange(index + 1)}
              style={{
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
                border: currentPage === index + 1 ? "2px solid blue" : "none",
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
