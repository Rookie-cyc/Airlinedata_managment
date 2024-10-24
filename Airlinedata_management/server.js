const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/airlineDB")
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

// Define the Passenger schema
const PassengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pnr: { type: String, unique: true, required: true }
});

// Create the Passenger model
const Passenger = mongoose.model('passengers', PassengerSchema);

// Create the server
const server = http.createServer((req, res) => {
    // Serve static CSS files
    if (req.url === '/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        const filePath = path.join(__dirname, 'styles.css');
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    if (req.url === '/' && req.method === 'GET') {
        // Serve the main HTML file
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const filePath = path.join(__dirname, 'index.html');
        fs.createReadStream(filePath).pipe(res);
    }
    else if (req.url === '/book' && req.method === 'GET') {
        // Serve the booking form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const filePath = path.join(__dirname, 'book.html');
        fs.createReadStream(filePath).pipe(res);
    }
    else if (req.url === '/signup' && req.method === 'POST') {
        // Handle booking submission
        let rawdata = '';
        req.on('data', (data) => {
            rawdata += data;
        });
        req.on('end', () => {
            const inputdata = new URLSearchParams(rawdata);
            
            // Generate a unique PNR
            const pnr = `${inputdata.get('name').slice(0, 3).toUpperCase()}-${Date.now()}`;

            const newPassenger = new Passenger({
                name: inputdata.get('name'),
                age: Number(inputdata.get('age')),
                departure: inputdata.get('departure'),
                arrival: inputdata.get('arrival'),
                startDate: new Date(inputdata.get('startDate')),
                endDate: new Date(inputdata.get('endDate')),
                pnr: pnr // Set the generated PNR
            });
            
            newPassenger.save()
                .then(() => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write("Passenger registered successfully! Your PNR is: " + pnr);
                    res.end();
                })
                .catch(err => {
                    console.error("Error while adding passenger:", err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.write("An error occurred while processing your registration.");
                    res.end();
                });
        });
    }
    else if (req.url === '/cancel' && req.method === 'GET') {
        // Serve the cancel form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const filePath = path.join(__dirname, 'cancel.html');
        fs.createReadStream(filePath).pipe(res);
    }
    else if (req.url === '/cancel' && req.method === 'POST') {
        // Handle cancellation submission
        let rawdata = '';
        req.on('data', (data) => {
            rawdata += data;
        });
        req.on('end', () => {
            const inputdata = new URLSearchParams(rawdata);
            const pnr = inputdata.get('pnr');
            Passenger.deleteOne({ pnr: pnr })
                .then(result => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    if (result.deletedCount > 0) {
                        res.write("Booking cancelled successfully!");
                    } else {
                        res.write("No booking found with the provided PNR.");
                    }
                    res.end();
                })
                .catch(err => {
                    console.error("Error while deleting booking:", err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.write("An error occurred while processing your cancellation.");
                    res.end();
                });
        });
    }
    else if (req.url === '/view' && req.method === 'GET') {
        // Serve the view form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const filePath = path.join(__dirname, 'view.html');
        fs.createReadStream(filePath).pipe(res);
    } 
    else if (req.url === '/view' && req.method === 'POST') {
        // Handle viewing passenger details
        let rawdata = '';
        req.on('data', (data) => {
            rawdata += data;
        });
        req.on('end', () => {
            const inputdata = new URLSearchParams(rawdata);
            const pnr = inputdata.get('pnr');
            
            Passenger.findOne({ pnr: pnr })
                .then(passenger => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    if (passenger) {
                        res.write(`<h1>Passenger Details</h1>
                            <p>Name: ${passenger.name}</p>
                            <p>Age: ${passenger.age}</p>
                            <p>Departure: ${passenger.departure}</p>
                            <p>Arrival: ${passenger.arrival}</p>
                            <p>Start Date: ${passenger.startDate.toLocaleDateString()}</p>
                            <p>End Date: ${passenger.endDate.toLocaleDateString()}</p>
                            <p>PNR: ${passenger.pnr}</p>
                        `);
                    } else {
                        res.write("No passenger found with the provided PNR.");
                    }
                    res.end();
                })
                .catch(err => {
                    console.error("Error while retrieving passenger:", err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.write("An error occurred while processing your request.");
                    res.end();
                });
        });
    }
    else {
        // Handle 404 for any other routes
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write("404 Not Found");
        res.end();
    }
});

// Start the server
server.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
});
