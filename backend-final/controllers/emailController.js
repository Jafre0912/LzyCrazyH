const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  try {
    const { subject, body, emails } = req.body;
    const attachedFiles = req.files;
    const emailList = JSON.parse(emails);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"LzyCrazy App" <${process.env.EMAIL_USER}>`,
      to: emailList.join(', '),
      subject: subject,
      html: body,
      attachments: [],
    };
    
    if (attachedFiles && attachedFiles.length > 0) {
      mailOptions.attachments = attachedFiles.map(file => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }

    // This is the most important line for debugging.
    console.log("HTML being sent from server:", body);

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Emails sent successfully!' });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: 'Failed to send emails.' });
  }
};