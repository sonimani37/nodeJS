const xlsx = require('xlsx');
const model = require('../models/overviewModel');


let overviewControl = {};

overviewControl.overview = async (req, resp) => {
    try{   
        console.log(req.body);
        console.log(req.body.countries);
        console.log(req.body.governance_id);
        await model.overview(req.body.governance_id,req.body.countries)
        .then(async result => {;
            console.log('result length',result?.rows.length);
            const transformedData = transformData(result?.rows);
            console.log('transformedData---------',(transformedData));
            resp.send(transformedData);
            // resp.send(result?.rows);
        })
        .catch(error => {
            console.error('Error executing Country Select query', error);
        });    
    }catch(error){
        console.log(error);
    }
}

function transformData(data) {
    console.log('data.length',data.length);
    const result = {};

    data.forEach((entry,index) => {
        // if(index < 2){
            console.log(entry);
            const developmentName = entry.development_name;
            const ultimateName = entry.ultimate_name;
            const taxonomyName = entry.taxonomy_name;
            const indicatorName = entry.indicator_name;
            const questionName = entry.question_name;

           // Check if developmentName exists in result, if not, create it
            if (!result[developmentName]) {
                result[developmentName] = {};
                console.log('----1result---',result);
            }
            
            // Check if ultimateName exists within developmentName, if not, create it
            if (!result[developmentName][ultimateName]) {
                result[developmentName][ultimateName] = {};
                console.log('-------2result----',result);
            }

            // Check if taxonomyName exists within ultimateName, if not, create it
            if (!result[developmentName][ultimateName][taxonomyName]) {
                result[developmentName][ultimateName][taxonomyName] = {};
                console.log('------3result----',result);
            }

            // Check if indicatorName exists within taxonomyName, if not, create it
            if (!result[developmentName][ultimateName][taxonomyName][indicatorName]) {
                result[developmentName][ultimateName][taxonomyName][indicatorName] = {};
                console.log('---------4result-----',result[developmentName][ultimateName][taxonomyName][indicatorName]);
                console.log('---------4result-----',result);
            }

             // Create a new entry under questionName with the desired properties
            result[developmentName][ultimateName][taxonomyName][indicatorName][questionName] = {
                "c_id": entry.country_id,
                "c_name": entry.country_name,
                "developement_id": entry.development_id,
                "development_name": developmentName,
                "ultimate_id": entry.ultimate_id,
                "ultimate_name": ultimateName,
                "country_id": entry.country_id,
                "country_name": entry.country_name,
                "taxonomy_id": entry.taxonomy_id,
                "taxonomy_name": taxonomyName,
                "indicator_id": entry.indicator_id,
                "indicator_name": indicatorName,
                "indicator_score": entry.indicator_score,
                "question_id": entry.question_id,
                "question_name": questionName,
                "question_score": entry.question_score,
                "status": entry.status,
                "actual_score": entry.actual_score
            };
            console.log('---------5result-----',result);
        // }
    });

    return result;
}



module.exports = overviewControl;
