const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'digital_health',
    password: 'postgres',
    port: 5432,
});


client.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.error('Error connecting to the database', err);
    });



module.exports = client ;


    // client.query('SELECT development.development_name, ultimate.ultimate_name FROM development LEFT JOIN ultimate ON ultimate.development_id = development.development_id')
    // client.query('SELECT development.development_name, ultimate.ultimate_name FROM development LEFT JOIN ultimate ON ultimate.development_id = development.development_id group by ultimate.development_id')
    // client.query(`
    // SELECT  development.development_name, STRING_AGG(ultimate.ultimate_name, ', ') AS ultimate_names FROM development
    // LEFT JOIN ultimate ON ultimate.development_id = development.development_id
    // GROUP BY development.development_name
    // `)
    // .then(result => {
    //     // console.log(result);
    //     // console.log('Query result:', result.rows);       
    //     })
    // .catch(err => {
    //     console.error('Error executing query', err);
    // });

// client.query('SELECT * FROM ultimate order by ultimate_id ASC')
//     .then(result => {
//         console.log('Query result:', result.rows);
//     })
//     .catch(err => {
//         console.error('Error executing query', err);
//     });