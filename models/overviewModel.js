
const client = require('../config');

async function overview(governance_id,country_id) {
    console.log(governance_id);
    console.log(country_id);
    const query = {
        text:`SELECT d.development_id,d.development_name,ul.ultimate_id,ul.ultimate_name, c.country_id,c.country_name, t.taxonomy_id, t.taxonomy_name, i.indicator_id,i.indicator_name,i.indicator_score,
        q.question_id,q.status,q.actual_score,qn.question_name
        FROM public.questions q
        JOIN country c ON c.country_id = q.country_id
        JOIN question_names qn ON qn.qname_id = q.qname_id
        JOIN indicators i ON i.indicator_id = q.indicator_id
        JOIN ultimate ul ON ul.ultimate_id = q.ultimate_id
        JOIN development d ON d.development_id = q.development_id
        JOIN taxonomy t ON t.taxonomy_id = i.taxonomy_id
        JOIN governance g ON g.governance_id = t.governance_id
        WHERE q.governance_id = $1 AND q.country_id = $2
        GROUP BY d.development_id,d.development_name,ul.ultimate_id,ul.ultimate_name,c.country_id, c.country_name,t.taxonomy_id, t.taxonomy_name, 
            i.indicator_id, i.indicator_name, i.indicator_score,q.question_id, q.status, q.actual_score, qn.question_name`,
        values: [governance_id,country_id], 
    }; 
     return client.query(query)
}   

module.exports = {
  overview,
};