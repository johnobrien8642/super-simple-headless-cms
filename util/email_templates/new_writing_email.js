export default function newWritingEmail(sub, data) {
    const string = `<html>
      <body>
        <p>${data.writingDesc}<p>
        <br>
        <a href=${process.env.NEXT_PUBLIC_URL}/util/unsubscribe?subtoken=${sub.jsonwebtoken}&unsubscribe="true">Click this link to unsubscribe.</a>
      </body>
    </html>`;

    return string;
}
