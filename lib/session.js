export const sessionOptions = {
    password: process.env.NEXT_PUBLIC_SECRET_KEY,
    cookieName: 'personal-site-cookie',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    }
};
