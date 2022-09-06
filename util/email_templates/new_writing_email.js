export default function newWritingEmail(sub, data) {

  const string = `<html>
      <body>
        <p>Hey, I've just uploaded new writing for <a href=${process.env.URL}/${data.writingType}/section?sectionId=${data.sectionId}>${data.writingTitle}</a>.</p>
        <p>${data.writingDesc}<p>
        <br>
        <a href=${process.env.URL}/util/unsubscribe?subtoken=${sub.jsonwebtoken}&unsubscribe="true">Click this link to unsubscribe.</a>
      </body>
    </html>`

  return string
}