const keys = {
    url:
        process.env.NODE_ENV === 'development'
            ? `http://localhost:${process.env.PORT}`
            : `https://www.johnedwardobrien.com`
};

export default keys;
