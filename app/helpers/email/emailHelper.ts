import sgMail from "@sendgrid/mail";
import { emailTokenSign } from "../emailTokenMiddleware";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("Should set Sendgrid API key!!");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY.replace("\r", ""));

const hostname = process.env.NODE_ENV === "production" ? "https://fpa-backend.herokuapp.com" : "http://www.lvh.me:3000";
const from = "no-reply@fpa.org";

function generateEmail(title: string, body: string) {
  return `<!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta http-equiv="content-type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style id="compiled-css" type="text/css">
        div {
          box-sizing: border-box;
        }

        .wrapper {
          margin: 0 auto;
          width: 600px;
          height: 760px;
          background-color: #eceff1;

          display:flex;
          flex-direction: column;
          align-items: center;
          border-radius: 16px;
          overflow:hidden;
        }

        .title {
          width: 100%;
          height: 80px;
          text-align: center;
          background-color: #00b0ff;  // material-color: Blue400A
        }

        .title > h1 {
          font-weight: bold;
          font-size: 1.8em;
          color: white;
        }


        .body {
          width: 100%;
          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;

          padding: 16px;

          font-size: 16px;
          line-height: 1.2;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 80px;
        }

        .body-title {
          font-weight: bold;
          font-size: 20px;
          line-height: 1.4;
        }

        .body-span {

        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="title">
          <h1>
            ${title}
          </h1>
        </div>

        <div class="body">
          ${body}
        </div>

        <div class="footer">
          ©everyAwake 2019,<a href="http://github.com/everyawake">Contact Us</a>
        </div>
      </div>
    </body>
    </html>`;
}

const welcomeMailHTML = (username: string, emailToken: string) => {
  const content = `
  <div class="body-title">${username}님의 가입을 FPA는 진심으로 환용합니다!</div>
  <div class="body-span">이제, FPA를 통해서 어디서든 안전하고 편리하게 로그인해보세요!</div>
  <a type="submit" href="${hostname}/auth/emailConfirmation?token=${emailToken}">인증</a>
  <img src="https://t1.daumcdn.net/cfile/tistory/250A604058ACA09E02" width="100%" height="100%"/>
  `;
  return generateEmail("FPA에 참여하신걸 환영합니다!", content);
};

async function mailSend(msg: { to: string; from: string; subject: string; html: string }) {
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error("[ERR] FAILED to MAIL SEND", err);
  }
}

const sendUserConfirmationEmail = (to: string) => {
  const msg = {
    to,
    from,
    subject: "Welcome to FPA!, plz confirm your email!!",
    html: "<h2>Welcome to Hello world!!</h2>"
  };

  mailSend(msg);
};

const sendWelcomeMail = ({ to, username, id }: { to: string; username: string; id: string }) => {
  const token = emailTokenSign({ email: to, username: username, id } as IEmailTokenData);
  const html = welcomeMailHTML(username, token);
  const msg = {
    to,
    from,
    subject: "회원가입을 축하드립니다!",
    html
  };

  mailSend(msg);
};

export { sendUserConfirmationEmail, sendWelcomeMail };
