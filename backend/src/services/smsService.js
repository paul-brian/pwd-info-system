const sendSMS = async (mobileNumber, message) => {
  try {
    const response = await fetch("https://unismsapi.com/api/sms", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(process.env.SMS_API_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: mobileNumber, 
        content:   message,      
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send SMS");
    }

    return { success: true, data };

  } catch (error) {
    console.error("SMS error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };