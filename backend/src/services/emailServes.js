const nodemailer = require("nodemailer");

// ✅ Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password — hindi regular password
  },
});

// ✅ Send Approved Email
exports.sendApprovedEmail = async ({ full_name, email, role }) => {
  const mailOptions = {
    from: `"Barangay Trapiche PWD System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ Your Access Request has been Approved!",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:36px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:32px;">✅</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Request Approved!</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Barangay Trapiche PWD Information System</p>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi <strong>${full_name}</strong>,</p>
              <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.6;">
                Great news! Your request to access the <strong>Barangay Trapiche PWD Information Management System</strong> has been <span style="color:#16a34a;font-weight:700;">approved</span> by the administrator.
              </p>

              <!-- Info Box -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Account Details</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">Full Name</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${full_name}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Role</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;text-transform:capitalize;">${role}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Password</td>
                    <td style="padding:6px 0;font-size:13px;">
                      <span style="background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:2px 8px;font-weight:700;font-family:monospace;color:#854d0e;">123456</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Warning -->
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#92400e;">
                  ⚠️ <strong>Important:</strong> Please change your password immediately after your first login for security purposes.
                </p>
              </div>

              <p style="color:#374151;font-size:14px;margin:0 0 8px;">You can now log in to the system using your email and the temporary password above.</p>
            </div>

            <!-- Footer -->
            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Barangay Trapiche PWD Information Management System</p>
              <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send approval email:", err.message);
  }
};

// ✅ Send Rejected Email
exports.sendRejectedEmail = async ({ full_name, email, role }) => {
  const mailOptions = {
    from: `"Barangay Trapiche PWD System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "❌ Your Access Request has been Rejected",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:36px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;">
                <span style="font-size:32px;line-height:64px;">❌</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;">Request Not Approved</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Barangay Trapiche PWD Information System</p>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi <strong>${full_name}</strong>,</p>
              <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.6;">
                We regret to inform you that your request to access the <strong>Barangay Trapiche PWD Information Management System</strong> as <strong>${role}</strong> has been <span style="color:#dc2626;font-weight:700;">rejected</span> by the administrator.
              </p>

              <!-- Info Box -->
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">Request Details</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">Full Name</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${full_name}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Requested Role</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;text-transform:capitalize;">${role}</td>
                  </tr>
                </table>
              </div>

              <p style="color:#374151;font-size:14px;margin:0 0 16px;line-height:1.6;">
                If you believe this is a mistake or you have additional information to provide, please contact the Barangay Trapiche office directly.
              </p>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                <p style="margin:0;font-size:13px;color:#64748b;">
                  📍 <strong>Barangay Trapiche Office</strong><br/>
                  You may visit or contact us during office hours for further assistance.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Barangay Trapiche PWD Information Management System</p>
              <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send rejection email:", err.message);
  }
};