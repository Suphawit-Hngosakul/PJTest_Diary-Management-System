const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const jwtSecret = "your_jwt_secret_key";
app.use(cors());
app.use(express.json());

// Connection string to connect to the SQL Server database
const dbconfig = {
  user: "sa",
  password: "YourStrong@Passw0rd",
  server: "localhost",
  database: "myDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

sql.connect(dbconfig, (err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("Connected to SQL Server");
    const request = new sql.Request();
    const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
            CREATE TABLE Users (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(50),
                email NVARCHAR(50) UNIQUE,
                password NVARCHAR(255)
            )
        `;
    request.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating table: ", err);
      } else {
        console.log("Table created successfully or already exists");
      }
    });
  }
});

//set PORT
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// API
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; // รับข้อมูลจาก request body
    const request = new sql.Request();
    const checkEmailQuery = `
            SELECT * FROM Users WHERE email = @Email
        `;
    request.input("email", sql.NVarChar, email);
    request.query(checkEmailQuery, async (err, result) => {
      if (err) {
        console.error("Error checking email: ", err); // แสดงข้อผิดพลาดหากการตรวจสอบอีเมลล้มเหลว
        res.status(500).send("Error checking email");
      } else if (result.recordset.length > 0) {
        res.status(400).send("Email already exists"); // แสดงข้อความเมื่ออีเมลมีอยู่แล้ว
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่าน
        const insertQuery = `
                    INSERT INTO Users (name, email, password)
                    VALUES (@name, @Email, @Password)
                `;
        request.input("name", sql.NVarChar, name);
        request.input("password", sql.NVarChar, hashedPassword);
        request.query(insertQuery, (err, result) => {
          if (err) {
            console.error("Error inserting data: ", err); // แสดงข้อผิดพลาดหากการบันทึกข้อมูลล้มเหลว
            res.status(500).send("Error inserting data");
          } else {
            res.send("Signup Success"); // แสดงข้อความเมื่อสมัครสมาชิกสำเร็จ
          }
        });
      }
    });
  } catch (err) {
    console.error("Server error: ", err); // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในเซิร์ฟเวอร์
    res.status(500).send("Server error");
  }
});

app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body; // รับข้อมูลจาก request body
        const request = new sql.Request();
        const selectQuery = `
            SELECT * FROM Users WHERE email = @Email
        `;
        request.input('email', sql.NVarChar, email);
        request.query(selectQuery, async (err, result) => {
            if (err) {
                console.error('Error fetching data: ', err); // แสดงข้อผิดพลาดหากการดึงข้อมูลล้มเหลว
                res.status(500).send('Error fetching data');
            } else if (result.recordset.length === 0) {
                res.status(400).send('Invalid email or password'); // แสดงข้อความเมื่ออีเมลหรือรหัสผ่านไม่ถูกต้อง
            } else {
                const user = result.recordset[0];
                const isPasswordValid = await bcrypt.compare(password, user.password); // ตรวจสอบรหัสผ่าน
                if (!isPasswordValid) {
                    res.status(400).send('Invalid email or password'); // แสดงข้อความเมื่อรหัสผ่านไม่ถูกต้อง
                } else {
                    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '1h' }); // สร้าง JWT
                    res.json({ token }); // ส่ง JWT กลับไปยังผู้ใช้
                }
            }
        });
    } catch (err) {
        console.error('Server error: ', err); // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในเซิร์ฟเวอร์
        res.status(500).send('Server error');
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization'); // รับ JWT จาก header
    if (!token) {
        return res.status(401).send('Access denied'); // แสดงข้อความเมื่อไม่มี JWT
    }
    try {
        const decoded = jwt.verify(token, jwtSecret); // ตรวจสอบ JWT
        req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ถอดรหัสแล้วใน request
        next(); // ไปยัง middleware ถัดไป
    } catch (err) {
        res.status(400).send('Invalid token'); // แสดงข้อความเมื่อ JWT ไม่ถูกต้อง
    }
};

// ตัวอย่างเส้นทางที่ป้องกันด้วย JWT
app.get('/home', authenticateJWT, (req, res) => {
    res.send('This is a protected route'); // แสดงข้อความเมื่อเข้าถึงเส้นทางที่ป้องกันได้
});