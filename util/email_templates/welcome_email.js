export default function welcomeEmail(sub) {

  const string = `<html>
      <body>
        <p>You're subscribed. Great job! Whenever I upload new writing, I'll send you another email.</p>
        <a href=${process.env.URL}/util/unsubscribe?subtoken=${sub.jsonwebtoken}&unsubscribe="true">Click this link to unsubscribe.</a>
      </body>
    </html>`

  return string
}