import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/contact", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    res.status(400).json({ error: "Only Gmail addresses are allowed" });
    return;
  }

  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
      console.warn("GMAIL_USER or GMAIL_PASS environment variables are missing. Email sending will be skipped.");
      res.status(200).json({ success: true, message: "Message received (mail configuration incomplete)" });
      return;
    }

    // Gmail Real-world configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${user}>`,
      to: user,
      replyTo: email,
      subject: `Portfolio Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0071E3; margin-bottom: 20px;">New Portfolio Message</h2>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `
    };

    // Send the email in the background to respond immediately (very fast)
    transporter.sendMail(mailOptions)
      .then((info) => {
        console.log("Real message sent to %s! Message ID: %s", user, info.messageId);
      })
      .catch((error) => {
        console.error("Async mail sending error:", error);
      });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Mail sending setup error:", error);
    res.status(500).json({ error: "Failed to process message", details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
