export const sessionOptions = {
  password: process.env.SECRET_KEY,
  cookieName: "personal-site-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};