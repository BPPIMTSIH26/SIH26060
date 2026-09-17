// utils/sendOtpEmail.js

// Add 'type' to the parameters, defaulting to 'reset'
const sendOtpEmail = async (email, otp, type = 'reset') => {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!appsScriptUrl) {
      console.warn('⚠️ [Warning] GOOGLE_APPS_SCRIPT_URL is not set in .env');
      return false;
    }

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      // Include the 'type' in the payload sent to Google
      body: JSON.stringify({ email, otp, type }), 
      redirect: 'follow' 
    });

    const result = await response.json();

    if (result.status === 'success') {
        console.log(`✅ [Transmission Sent] OTP (${type}) dispatched to ${email}`);
        return true;
    } else {
        console.error('❌ [Apps Script Error]', result.message);
        return false;
    }

  } catch (error) {
    console.error('❌ [Network Error connecting to Google]', error.message);
    return false;
  }
};

module.exports = sendOtpEmail;