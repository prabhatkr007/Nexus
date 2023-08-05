const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const apiRoutes = require('./Routes/api');
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');



const app = express();

require('./DB/conn.js');

//middleware
// app.use(cors({
//     credentials: true,
//     origin:'https://blog-app-nine-rust.vercel.app'
// }));

app.use(express.json());
app.use(cookieParser());
app.use('/api/uploads', express.static(__dirname + '/uploads'));
app.use('/api',apiRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json('Internal Server Error');
  });
  
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/api`);
});
