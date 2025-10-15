// backend/index.js
const dotenv = require("dotenv")
dotenv.config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();
const Routes = require("./routes/route.js")
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }))
app.use(cors())
// backend/index.js
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(" Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

app.use('/', Routes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})
