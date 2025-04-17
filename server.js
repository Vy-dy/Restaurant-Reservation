const express = require('express');
const path = require('path');

const app = express();
const port = 5500;

// Serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, 'assets')));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Define a route to serve the reservation HTML file
app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'reservation.html'));
});

// Handle form submission for reservation
app.post('/submitReservation', (req, res) => {
  // Extract form data from the request body
  const { name, phone, person, date, time, message } = req.body;

  // Connect to Microsoft Access database
  try {
    const conn = new ActiveXObject("ADODB.Connection");
    const connStr = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\vydy3\\OneDrive\\Desktop\\Restaurant\\Restaurant\\Reservations.accdb;Persist Security Info=False;";
    conn.Open(connStr);

    const rs = new ActiveXObject("ADODB.Recordset");
    rs.Open("Reservations", conn, 1, 3); // 1 = adOpenKeyset, 3 = adLockOptimistic

    rs.AddNew();
    rs.Fields("Name").Value = name;
    rs.Fields("Phone").Value = phone;
    rs.Fields("Person").Value = person;
    rs.Fields("Date").Value = date;
    rs.Fields("Time").Value = time;
    rs.Fields("Message").Value = message;
    rs.Update();

    rs.Close();
    conn.Close();

    // Respond to the client with a success message
    res.send('Reservation submitted successfully!');
  } catch (error) {
    // Respond to the client with an error message
    console.error("Error: " + error.message);
    res.status(500).send('An error occurred while saving the reservation.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
