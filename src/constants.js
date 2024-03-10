export const DEBUG = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
if (DEBUG)
    console.log("DEBUG mode enabled")
export const API_URL = DEBUG ? "http://localhost:8000/api/" : "https://smartycope.pythonanywhere.com/api/"
