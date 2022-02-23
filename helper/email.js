const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getOrderConfirmationEmailHtml(customerName) {
  return `
  <html>
    <head>
      <title>welcome</title>
    </head>
    <body>
    <div style="margin-top:32px; text-align: center">
     <img src="https://www.vedusone.com/logo.svg" alt="Logo" title="Logo" style="display:block" width="104" height="72"  />
     </div>
     <div style="font-family: sans-serif;  margin-top:32px; text-align: center"><span style="font-size: 24px"><strong>Welcome ${customerName},&nbsp;</strong></span></div>
<div style="font-family: sans-serif; text-align: inherit"><br></div>
<div style="font-family: sans-serif; text-align: center">We are glad to see you at vedasOne Academy.</div>
<div style="border-radius:6px; font-family: sans-serif; margin-top:32px;font-size:16px; text-align:center; background-color:inherit;">
                  <a href="https://www.vedusone.com" style="background-color:#4fbaba; border:1px solid #ffffff; border-color:#ffffff; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Welcome To VedasOne</a>
                </div>
    </body>
  </html>
`;
}

function setResetPasswordTemplate(pwdLink) {
  return `
  <html>
    <head>
      <title>welcome</title>
    </head>
    <body>
    <div style="margin-top:32px; text-align: center">
     <img src="https://www.vedusone.com/logo.svg" alt="Logo" title="Logo" style="display:block" width="104" height="72"  />
     </div>
   
<div style="font-family: sans-serif; text-align: inherit"><br></div>
<div style="font-family: sans-serif; text-align: center">${pwdLink}</div>
<div style="border-radius:6px; font-family: sans-serif; margin-top:32px;font-size:16px; text-align:center; background-color:inherit;">
                  <a href=${pwdLink} style="background-color:#4fbaba; border:1px solid #ffffff; border-color:#ffffff; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Reset Password</a>
                </div>
    </body>
  </html>
`;
}

function getMessage(emailParams) {
  return {
    to: emailParams.fields.email,
    from: "anand.k.rajneesh@hotmail.com",
    subject: emailParams.fields.subject
      ? emailParams.fields.subject
      : "Welcome to VedasOne Academy",
    text: `Welcome ${emailParams.fields.name}, We are glad to see you at VedasOne Academy.`,
    html: getOrderConfirmationEmailHtml(emailParams.fields.name),
  };
}

function resetPasswordMessage(emailParams) {
  return {
    to: emailParams.email,
    from: "anand.k.rajneesh@hotmail.com",
    subject: "VedusOne Reset Password Link",
    text: "Click here to reset your password",
    html: setResetPasswordTemplate(emailParams.pwdLink),
  };
}

async function sendEmail(emailParams) {
  console.log(emailParams);
  try {
    await sendGridMail.send(getMessage(emailParams));
    return {
      message: "success",
    };
  } catch (error) {
    const message = "failed";
    console.error(message);
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { message };
  }
}

async function sendPasswordResetEmail(emailParams) {
  console.log(emailParams);
  try {
    await sendGridMail.send(resetPasswordMessage(emailParams));
    return {
      message: "success",
    };
  } catch (error) {
    const message = "failed";
    console.error(message);
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { message };
  }
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};
