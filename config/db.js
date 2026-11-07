const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'DESKTOP-PTC16KN\\SQLEXPRESS03',
    database: 'todo_app',
    driver: 'ODBC Driver 17 for SQL Server',

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('SQL Server connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

module.exports = {
    sql,
    connectDB
};