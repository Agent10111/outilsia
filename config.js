require('dotenv').config();

module.exports = {
    API_HOST: process.env.API_HOST || 'http://localhost:3001',
    PORT: process.env.PORT || 3001,
    OPEN_WEBUI_PORT: process.env.OPEN_WEBUI_PORT || 8081,
    OPEN_WEBUI_API_KEY: process.env.OPEN_WEBUI_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
}; 