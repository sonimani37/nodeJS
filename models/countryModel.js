
const client = require('../config');

async function allCountry() {
    const countries_select = 'SELECT * FROM country';
    return client.query(countries_select)
}

async function countries_by_groupYear(year) {  
    const yearCount = year.split(',').map(Number);
    console.log(yearCount);
    const query = {
        text: `
            SELECT year, ARRAY_AGG(country_name) AS countries
            FROM country
            WHERE year = ANY($1::int[])
            GROUP BY year
            ORDER BY year;
        `,
        values: [yearCount]
      };
      return client.query(query)
}

async function countries_by_year(country_id) {
    const idCount = country_id.split(',').map(Number);
    const query = {
        text: 'SELECT * FROM country WHERE country_id = ANY($1::int[])',
        values: [idCount],
      };
      return client.query(query)
}


async function comparative_overview(governance_id,country_id) {
    const idCount = country_id.split(',').map(Number);
    console.log(governance_id);
    console.log(idCount);
    const query = {
        text:'SELECT * FROM development d LEFT JOIN ultimate u ON d.development_id = u.development_id LEFT JOIN taxonomy t ON t.governance_id = $1 LEFT JOIN indicators i ON t.taxonomy_id = i.taxonomy_id LEFT JOIN questions q ON i.indicator_id = q.indicator_id LEFT JOIN question_names qn ON q.qname_id = qn.qname_id LEFT JOIN country c ON c.country_id = ANY($2::int[])',
        values: [governance_id,idCount], // idCount should contain [13, 14] based on your criteria
    }; 
    
    // const query = {
    //     // text:'SELECT * FROM questions q LEFT JOIN country c ON q.country_id = c.country_id WHERE c.country_id = ANY($1::int[])',
    //     text:'SELECT * FROM development d LEFT JOIN ultimate u ON d.development_id = u.development_id LEFT JOIN taxonomy t ON t.governance_id = $1 LEFT JOIN indicators i ON t.taxonomy_id = i.taxonomy_id LEFT JOIN questions q ON i.indicator_id = q.indicator_id LEFT JOIN question_names qn ON q.qname_id = qn.qname_id WHERE q.country_id = ANY($2::int[])',
    //     values: [governance_id,idCount], // idCount should contain [13, 14] based on your criteria
    // };   

    return client.query(query)
}   

module.exports = {
    allCountry,
    comparative_overview,
    countries_by_year,
    countries_by_groupYear
};