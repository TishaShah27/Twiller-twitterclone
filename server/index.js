require("dotenv").config();
const twilio = require("twilio");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const uri = process.env.MONGO_URI;
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
const client = new MongoClient(uri);
const fetch = require("node-fetch"); // or use axios
const router = express.Router();

function generateRandomPassword(length = 10) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const allChars = uppercase + lowercase;
  // const saveAvatarRoute = require('./routes/save-avatar');
  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return password;
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");
    const otpStore = new Map();

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .send({ error: "Email and password are required" });
      }

      try { 
        const user = await usercollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).send({ error: "Invalid password" });
        }

        res.send({ message: "Login successful",
          user: {
    email: user.email,
    name: user.name,
    username: user.username,
    phone: user.phone,
  },
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    // Your route handlers go here (copy from your existing code)
        app.post("/register", async (req, res) => {
      const { username, name, email, phone, password } = req.body;

      // Basic validation
      if (!email || !username || !name || !password) {
        return res.status(400).send({ error: "Required fields are missing" });
      }

      try {
        // Check if email already exists
        const existingEmail = await usercollection.findOne({ email });
        if (existingEmail) {
          return res.status(409).send({ error: "Email already exists" });
        }

        // Check if username already exists
        const existingUsername = await usercollection.findOne({ username });
        if (existingUsername) {
          return res.status(409).send({ error: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const result = await usercollection.insertOne({
          username,
          name,
          email,
          phone,
          password: hashedPassword,
        });

        res.status(201).send({
  message: "User registered successfully",
  user: {
    username,
    name,
    email,
    phone,
  },
});
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    
const RECAPTCHA_SECRET = "your-secret-key"; // from reCAPTCHA dashboard

router.post("/verify-recaptcha", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
    { method: "POST" }
  );
  const data = await response.json();

  if (data.success) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, error: data["error-codes"] });
  }
});

module.exports = router;


    app.get("/loggedinuser", async (req, res) => {
    const email = req.query.email;
    const user = await usercollection.findOne({ email: email });
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send({ email: user.email, phone: user.phone || null, /* other fields as needed */ });
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });

    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });

    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = { email: req.query.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });


  app.post("/update-phone", async (req, res) => {
  const { phone } = req.body;
  console.log("Update phone request:", { phone });

  if (!phone) {
    return res.status(400).send({ error: "Phone is required" });
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).send({ error: "Invalid phone number format" });
  }

  try {
    // Upsert = true → create new document if it doesn't exist
    const result = await usercollection.updateOne(
      { phone: phone }, // match by phone
      { $set: { phone: phone } },
      { upsert: true }
    );

    console.log("Update result:", result);
    res.send({ message: "Phone number saved successfully" });
  } catch (error) {
    console.error("Error updating phone:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});


app.post("/send-otp-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from:`"Twiller Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.send({ message: "OTP sent via email" });
  } catch (error) {
    res.status(500).send({ error: "Failed to send OTP email" });
  }
});

// Email OTP verify route
app.post("/verify-otp-email", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send({ error: "Email and OTP are required" });

  const validOtp = otpStore.get(email);
  if (validOtp === otp) {
    otpStore.delete(email);
    return res.send({ message: "Email OTP verified" });
  }
  res.status(400).send({ error: "Invalid OTP" });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  app.post("/forgot-password", async (req, res) => {
      try {
        const { emailOrPhone } = req.body;

        if (!emailOrPhone) {
          return res.status(400).send({ error: "Email or phone is required" });
        }
        const user = await usercollection.findOne({
          $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        const today = new Date().toISOString().slice(0, 10);
        if (user.lastPasswordReset === today) {
          return res.status(429).send({
            error: "Password reset already requested today. Try again tomorrow.",
          });
        }
        const newPassword = generateRandomPassword(10);

        await usercollection.updateOne(
          { _id: user._id },
          { $set: { password: newPassword, lastPasswordReset: today } }
        );

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Twiller Support" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Your Twiller Password Reset",
          text: `Hello,\n\nYour new password is: ${newPassword}\n\nPlease log in using this password and change it after logging in.\n\n- Twiller Team`,
        };

        await transporter.sendMail(mailOptions);

        console.log("New password emailed to:", user.email);

        res.send({ message: "Password reset successful. Check your email." });
      } catch (error) {
        console.error("Error in forgot-password:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    // save avatar 
    app.post('/save-avatar', async (req, res) => {
  const { email, avatar,useAvatar } = req.body;

  if (!email || !avatar) {
    return res.status(400).json({ error: 'Email and avatar are required' });
  }

  try {
    const result = await client
      .db('database')
      .collection('users')
      .updateOne(
        { email },
        { $set: {avatar, useAvatar } },
        { upsert: true },
      );

    res.status(200).json({ message: 'Avatar saved successfully', result });
  } catch (error) {
    console.error('Error saving avatar:', error);
    res.status(500).json({ error: 'Failed to save avatar' });
  }
});


    // Start server only after MongoDB connection is successful
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
  

app.get('/', (req, res) => {
  res.json({ message: "Twiller is working" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

}

// Call the run function to start everything
run();
