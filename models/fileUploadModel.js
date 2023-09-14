
const client = require('../config');

async function getUltimateByName(ultimateName) {
    const ulti_query =  { text: 'SELECT * FROM ultimate WHERE ultimate_name = $1', values: [ultimateName]};
    return client.query(ulti_query)
}

async function getUltimateById(ultimateId) {
    const ulti_query =  { text: 'SELECT * FROM ultimate WHERE ultimate_id = $1', values: [ultimateId]};
    return client.query(ulti_query)
}

async function selectTaxonomy(taxonomyName) {
    const taxo_select = { text: 'SELECT * FROM taxonomy WHERE taxonomy_name = $1', values: [taxonomyName]};
    return client.query(taxo_select)
}

async function insertTaxonomy(taxonomyName,governanceId) {
    const taxo_insert = {
        text: 'INSERT INTO taxonomy (taxonomy_name,governance_id) VALUES ($1, $2) RETURNING taxonomy_id',
        values: [taxonomyName,governanceId],
    };
   return client.query(taxo_insert)
}
async function insertTaxonomyy(taxonomyName,governanceId,taxonomyScore) {
    const taxo_insert = {
        text: 'INSERT INTO taxonomy (taxonomy_name,governance_id,taxonomy_score) VALUES ($1, $2, $3) RETURNING taxonomy_id',
        values: [taxonomyName,governanceId,taxonomyScore],
    };
   return client.query(taxo_insert)
}

async function getIndicatorByName(indicatorName) {
    const indic_select = { text: 'SELECT * FROM indicators WHERE indicator_name = $1', values: [indicatorName]};
    return client.query(indic_select)
}

async function insertIndicator(indicatorName,taxonomy_id,indicatorScore) {
    const indic_insert = {
        text: 'INSERT INTO indicators (indicator_name, taxonomy_id,indicator_score) VALUES ($1, $2, $3) RETURNING indicator_id',
        values: [indicatorName, taxonomy_id,indicatorScore],
    };
    return client.query(indic_insert)
}

async function selectCountryById(country_id,year) {
    const quest_select = {text: 'SELECT COUNT(*) FROM questions WHERE country_id = $1 AND years = $2',values: [country_id,year] };
    return client.query(quest_select)
}

async function selectQname(country_id,year) {
    const quest_select = {text: 'SELECT qname_id FROM questions WHERE country_id = $1 AND years = $2',values: [country_id,year] };
    return client.query(quest_select)
}

async function deleteQnameByID(qname_id) {
    const deleteQuery = {text: 'DELETE FROM question_names WHERE qname_id = $1', 
                        values: [qname_id]};
    return client.query(deleteQuery);
}


async function selectCountryByName(country_name) {
    console.log(country_name);
    const country_select = {
        text: 'SELECT * FROM country WHERE country_name = $1',
        values: [country_name] 
    };
    return client.query(country_select)
}

async function deleteCountryIdQuestions(countryId,year) {
    console.log('year Model',year);
    console.log('countryIdModel',countryId);
    const deleteQuery = {text: 'DELETE FROM questions WHERE years = $1 AND country_id = $2', 
                        values: [year,countryId]};
    return client.query(deleteQuery);
}

async function deleteQuestions(year,ultimate_id,governanceId) {
    const deleteQuest = {text: 'DELETE FROM questions WHERE years = $1 AND ultimate_id = $2 AND governance_id = $3', 
    values: [year,ultimate_id,governanceId]};
    return client.query(deleteQuest)
}

async function selectQuestionName(questionName) {
    const quest_insert = {
        text: 'SELECT * FROM question_names WHERE question_name = $1', 
        values: [questionName],
    };
    return client.query(quest_insert)
}
 
async function insertQuestionName(questionName) {
    const quest_insert = {
        text: 'INSERT INTO question_names (question_name) VALUES ($1) RETURNING qname_id',
        values: [questionName],
    };
    return client.query(quest_insert)
}

async function insertQuestion(qname_id,questionScore,actualScore,year,countryId,indicator_id,taxonomy_id,ultimate_id, status,text,links,governanceId,development_id) {
    const quest_insert = {
        text: 'INSERT INTO questions (qname_id,question_score,actual_score,years,country_id,indicator_id,taxonomy_id,ultimate_id,status,text,links,governance_id,development_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING question_id',
        values: [qname_id,questionScore,actualScore,year,countryId,indicator_id,taxonomy_id,ultimate_id, status,text,links,governanceId,development_id],
    };
    return client.query(quest_insert)
}

async function insertQuestionCountyScore(qname_id,questionScore,actual_score,year,countryId,indicator_id,taxonomy_id,ultimate_id,governanceId,development_id) {
    const quest_insert = {
        text: 'INSERT INTO questions (qname_id,question_score,actual_score,years,country_id,indicator_id,taxonomy_id,ultimate_id,governance_id,development_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING question_id',
        values: [qname_id,questionScore,actual_score,year,countryId,indicator_id,taxonomy_id,ultimate_id,governanceId,development_id],
    };
    return client.query(quest_insert)
}


// async function selectCountOfCountry(year,ultimate_id,taxonomy_id,indicator_id,countryId) {
//         const quest_select = {text: 'SELECT COUNT(*) FROM questions WHERE years = $1 AND ultimate_id = $2 AND taxonomy_id = $3 AND indicator_id = $4 AND country_id = $5',
//         values: [year,ultimate_id,taxonomy_id,indicator_id,countryId] };
//         return client.query(quest_select)
// }

async function selectCountOfCountry(year,ultimate_id,governanceId) {
    const quest_select = {text: 'SELECT COUNT(*) FROM questions WHERE years = $1 AND ultimate_id = $2 AND governance_id = $3',
    values: [year,ultimate_id,governanceId] };
    return client.query(quest_select)
}

module.exports = {
    getUltimateById,
    getUltimateByName,

    selectTaxonomy,
    insertTaxonomy,
    insertTaxonomyy,

    getIndicatorByName,
    insertIndicator,

    selectCountryById,
    selectQname,
    deleteQnameByID,
    selectCountryByName,
    deleteCountryIdQuestions,
    deleteQuestions,

    selectQuestionName,
    insertQuestionName,
    insertQuestion,

    insertQuestionCountyScore,
    selectCountOfCountry
};