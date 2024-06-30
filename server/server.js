import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const dbPath = './server/db/mydatabase.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      TransactionId INTEGER PRIMARY KEY,
      Status TEXT,
      Type TEXT,
      ClientName TEXT,
      Amount REAL
    )`);
  }
});

//import data in db
app.post('/addTransaction', (req, res) => {
  
  const transactions = req.body;
 
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of transactions.' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION', async (err) => {
      if (err) {
        console.error('Failed to begin transaction:', err.message);
        return res.status(500).json({ error: 'Failed to begin transaction' });
      }

      try {
        const stmt = db.prepare(`INSERT INTO transactions (TransactionId, Status, Type, ClientName, Amount)
            VALUES (?, ?, ?, ?, ?)`);

        for (const transaction of transactions) {
          const { TransactionId, Status, Type, ClientName, Amount } = transaction;
          await stmt.run(TransactionId, Status, Type, ClientName, Amount);
        }

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Failed to commit transaction:', err.message);
            return res.status(500).json({ error: 'Failed to commit transaction' });
          }
          res.json({ message: 'Transactions inserted successfully' });
        });
      } catch (error) {
        console.error('Error inserting transactions:', error.message);
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to insert transactions' });
      } 
    });
  });
});

//all transactions
app.get('/getAllTransactions', (req, res) => {
  const { page, sortBy, sortOrder, searchClientName, status, type } = req.query;
  const itemsPerPage = 10;
  const offset = (parseInt(page) - 1) * itemsPerPage;

  let query = `SELECT * FROM transactions`;
  let countQuery = `SELECT COUNT(*) as totalCount FROM transactions`;

  const queryParams = [];

   if (status || type || searchClientName) {
    query += ` WHERE 1`;
    countQuery += ` WHERE 1`;
    if(searchClientName) {
      query += ` AND ClientName LIKE '%${searchClientName}%'`;
      countQuery += ` AND ClientName LIKE '%${searchClientName}%'`;
    }
  if(status) {
    query+= ` AND Status = '${status}'`;
    countQuery += ` AND Status = '${status}'`;
  }
  if(type) {
    query+= ` AND Type = '${type}'`;
    countQuery += ` AND Type = '${type}'`;
  }
  }
 
  if(sortBy && sortOrder) {
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(itemsPerPage);
  queryParams.push(offset);

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error('Error fetching transactions:', err.message);
      return res.status(500).json({ error: 'Error fetching transactions' });
    }

    db.get(countQuery, queryParams.slice(0, -2), (err, row) => {
      if (err) {
        console.error('Error fetching total count:', err.message);
        return res.status(500).json({ error: 'Error fetching total count' });
      }
      const totalCount = row ? row.totalCount : 0;
      res.json({ transactions: rows, totalCount });
    });
  });
});

//export data
app.get('/getAllTransactionsForExport', (req, res) => {
  const { sortBy, sortOrder, searchClientName, status, type } = req.query;

  let query = `SELECT * FROM transactions`;

  const queryParams = [];

   if (status || type || searchClientName) {
    query += ` WHERE 1`;
    if(searchClientName) {
      query += ` AND ClientName LIKE '%${searchClientName}%'`;
    }
  if(status) {
    query+= ` AND Status = '${status}'`;
  }
  if(type) {
    query+= ` AND Type = '${type}'`;
  }
  }
 
  if(sortBy && sortOrder) {
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error('Error fetching transactions:', err.message);
      return res.status(500).json({ error: 'Error fetching transactions' });
    }
      res.json({ rows});

  });
});

//edit status
app.put('/editTransactionStatus/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'TransactionId and status are required' });
  }

  const updateQuery = `UPDATE transactions SET Status = ? WHERE TransactionId = ?`;

  db.run(updateQuery, [status, id], function (err) {
    if (err) {
      console.error('Error updating transaction status:', err.message);
      return res.status(500).json({ error: 'Error updating transaction status' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: `Transaction with TransactionId ${id} not found `});
    }

    res.json({ message: `Transaction ${id} status updated successfully `});
   });
});

//delete transaction
app.delete('/deleteTransaction/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM transactions WHERE TransactionId = ?', id, (err) => {
    if (err) {
      console.error('Error deleting transaction:', err.message);
      return res.status(500).json({ error: 'Error deleting transaction' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});