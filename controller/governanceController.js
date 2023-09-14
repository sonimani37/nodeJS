const xlsx = require('xlsx');
const model = require('../models/fileUploadModel');

let govController = {};

govController.uploadedFile = async (req, resp) => {
    try{
        const governanceId = req.body.governance_id;
        const uploadedFile = req.file;
        const year = req.body.year;
        console.log(governanceId);
        console.log(uploadedFile);
        console.log(year);
        if (!uploadedFile) {
          return resp.status(400).send('No file uploaded.');
        }
        const workbook = xlsx.readFile(uploadedFile.path);
        // console.log( workbook);
        console.log( workbook.SheetNames);
        for (const [index, sheetName] of workbook.SheetNames.entries()) {
                console.log('------------index-------',index);
                console.log('------------sheetName-------',sheetName);
                const sheet = workbook.Sheets[sheetName];
                const sheetData = xlsx.utils.sheet_to_json(sheet);

                await processSheet(sheetName, sheetData, governanceId,year,index);
        }
        resp.send('POST request received');

    }catch(error){
        console.log(error);
    }
}

async function processSheet(sheetName, sheetData, governanceId,year,index) {
    console.log(sheetName);
    console.log(governanceId);
    console.log(sheetData.length);
    console.log(year);
    allTaxonomy = ['Healthcare Governance','IT Governance','IT Workforce & Infrastructure',
    'Healthcare workforce and Infrastructure','AI Workforce/Infrastructure',
    'Digital Health (DH) Governance','DH Infrastructure','Workforce (Technical and Health care)',
    'Funding and resources','Legal rules','Research Program and funding',
    'Literacy (patient+ workforce)'];

    for (let i = 0; i < sheetData.length; i++) {
        // if(i == 0){
            console.log('---------------------------------------start---------------------------------------',i);
            const data = sheetData[i];
            console.log(data);
            const ultimate_id = data?.Ultimate;
            const taxonomyName = data?.Taxonomy?.trimEnd();
            var taxonomyScore;
            if (typeof taxonomyName === 'string'){
                const taxoScoreMatch = taxonomyName?.match(/\((\d+)\)/);
                taxonomyScore = taxoScoreMatch ? parseInt(taxoScoreMatch[1]) : null;
            }
            var indicatorName = data.Indicators?.trimEnd();
            console.log('----before indicatorName----',indicatorName);
            var indicatorScore;
            if (typeof indicatorName === 'string'){
                const indicScoreMatch = indicatorName.match(/\((\d+)\)/);
                indicatorScore = indicScoreMatch ? parseInt(indicScoreMatch[1]) : null;

                const inputString = indicatorName;
                indicatorName = inputString.replace(/\(\d+\)/, "")?.trim();
                console.log('after indicatorName',indicatorName);
            }
            var questionName = data.Questions?.trimEnd();
            var questionScore;
            if (typeof questionName === 'string'){
                const actualScoreMatch = questionName.match(/\((\d+)\)/);
                questionScore = actualScoreMatch ? parseInt(actualScoreMatch[1]) : null;

                const inputString = questionName;
                questionName = inputString.replace(/\(\d+\)/, "")?.trim();
                console.log('after questionName',questionName);
            }
            console.log('-----------ultimate_id----------',ultimate_id,'-----------------');
            await model.getUltimateById(ultimate_id)
            .then(async (result) =>{
                // console.log(result);
                const development_id = result.rows[0]?.['development_id'];
                 console.log('development_id--------',development_id);
                 // console.log('taxonomyName--------',taxonomyName);
                // console.log('taxonomyScore--------',taxonomyScore);
                var newTaxonomyName;
                const filteredTaxonomy = await allTaxonomy.filter((taxonomy) =>
                taxonomyName.includes(taxonomy)
                );
                console.log(filteredTaxonomy);
                if(filteredTaxonomy){
                    newTaxonomyName = filteredTaxonomy[0];
                    console.log('taxonomyName--------',newTaxonomyName);
                }
                if(newTaxonomyName != undefined){
                    console.log('new----- taxonomyName--------',newTaxonomyName)
                    await model.selectTaxonomy(newTaxonomyName)
                    .then(async (result) =>{
                        var taxonomy_id;
                        if(result?.rows?.length > 0){
                            console.log('Taxonomy Select result:', result.rows);
                            taxonomy_id = result.rows[0].taxonomy_id;
                            console.log('-------taxonomy_id--------',taxonomy_id,'-----------------');
                            console.log('----------Taxonomy--ultimate_id----------',ultimate_id,'-----------------');
                            console.log('----------Taxonomy--governanceId----------',governanceId,'-----------------');
                        }else{
                            console.log('Taxonomy Insert result:', taxonomyName);
                            console.log('----------Taxonomy--ultimate_id----------',ultimate_id,'-----------------');
                            console.log('----------Taxonomy--governanceId----------',governanceId,'-----------------');
                            await model.insertTaxonomy(taxonomyName,governanceId)
                                .then((result) =>{
                                        console.log('Taxonomy Insert result:', result.rows);
                                        taxonomy_id = result.rows[0]['taxonomy_id'];
                                        console.log('-------taxonomy_id--------',taxonomy_id,'-----------------');
                                }).catch((err) => {
                                        console.error('Error executing Taxonomy query', err);
                                });
                        } 
                        // console.log('IndicatorsName--------------',indicatorName);
                        // console.log('indicatorScore--------------',indicatorScore);
                        await model.getIndicatorByName(indicatorName)
                        .then(async (result) =>{
                            var indicator_id;
                            if(result?.rows?.length > 0){
                                console.log('Indicators Select result:', result.rows);
                                indicator_id = result.rows[0].indicator_id;
                                console.log('-------indicator_id--------',indicator_id,'-----------------');  
                                console.log('----------Indicators--taxonomy_id----------',taxonomy_id,'-----------------');

                            }else{
                                console.log('Indicators Insert result:', indicatorName);
                                console.log('----------Indicators--taxonomy_id----------',taxonomy_id,'-----------------');
                                await model.insertIndicator(indicatorName, taxonomy_id,indicatorScore)
                                .then((result) =>{
                                        console.log('Taxonomy Insert result:', result.rows);
                                        indicator_id = result.rows[0]['indicator_id'];
                                        console.log('-------indicator_id--------',indicator_id,'-----------------');
                                }).catch((err) => {
                                        console.error('Error executing indicator_id query', err);
                                });
                            } 

                            // console.log('questionName--------------',questionName);
                            // console.log('questionScore--------------',questionScore);
                            if(index == 0){
                                console.log('-------------------------------------------------------------index only 1 time ------------------',index);
                                await model.selectCountOfCountry(year,ultimate_id,governanceId)
                                .then(async result => {
                                    const countryIdCount = parseInt(result.rows[0].count);
                                    if(countryIdCount > 0){
                                        console.log('----if--countryIdCount-------', countryIdCount);
                                        console.log(`Country ID ${countryIdCount} exists in the question_table.`);
                                        await model.deleteQuestions(year,ultimate_id,governanceId)
                                        .then(async result => {
                                            console.log('Questions deleted result:', result.rows);
                                        })
                                        .catch(err => {
                                            console.error('Error executing Questions deleted query', err);
                                        });
                                    }    
                                })
                                .catch(error => {
                                    console.error('Error executing Question Select query', error);
                                });    
                            }     
                                
                            for(const [index,countryName] of Object.keys(data).entries()){
                                if(countryName != 'Ultimate' && countryName != 'Taxonomy' && countryName != 'Indicators' && countryName != 'Questions'){
                                    console.log('-----------------------country-indexxx----------------------------',index);
                                    console.log('--------------------countryName--------------------',countryName);
                                    var actual_score = data[countryName];
                                    await model.selectCountryByName(countryName?.trimEnd())
                                    .then(async (countryResult) => {
                                        var countryId;
                                        if (countryResult?.rows?.length > 0) {
                                            countryId = countryResult.rows[0].country_id;
                                        }
                                        // console.log('----------countryId---------------------------------',countryId);
                                        // console.log('----------indicator_id------------------------------',indicator_id);
                                        // console.log('----------questionName------------------------------',questionName);
                                        // console.log('----------questionScore-----------------------------',questionScore);
                                        // console.log('----------actual_score------------------------------', actual_score);
                                        // console.log('----------taxonomy_id--------------------------------------',taxonomy_id);
                                        // console.log('----------year--------------------------=-------------------------',year);
                                        // console.log('----------ultimate_id--------------------------------------',ultimate_id);
                                        // console.log('----------governanceId--------------------------------------',governanceId);

                                        console.log('questionName--------------',questionName); 
                                        await model.selectQuestionName(questionName)
                                        .then(async result => {
                                            var qname_id;
                                            if(result?.rows?.length > 0){
                                                console.log('Question Name Select result:', result.rows);
                                                qname_id = result.rows[0]['qname_id'];
                                                console.log('-------qname_id--------',qname_id,'-----------------');  
                                            }else{
                                                console.log('Questions Name Insert result:', questionName);
                                                await model.insertQuestionName(questionName)
                                                .then((result) =>{
                                                        console.log('Questions Name Insert result:', result.rows);
                                                        qname_id = result.rows[0]['qname_id'];
                                                        console.log('-------qname_id--------',qname_id,'-----------------');
                                                }).catch((err) => {
                                                        console.error('Error executing qname_id query', err);
                                                });
                                            } 
                                                console.log('qname_id--------------',qname_id);
                                                console.log('questionScore--------',questionScore);
                                                console.log('governanceId--------------',governanceId);   
                                                console.log('ultimate_id--------------',ultimate_id);   
                                                console.log('development_id--------------',development_id);   
                                                console.log('taxonomy_id--------------',taxonomy_id);   
                                                console.log('indicator_id--------------',indicator_id);   
                                                console.log('countryId--------------',countryId);   
                                                console.log('year-------',parseInt(year));
                                                console.log('Actual Score-------',actual_score);
                                                
                                                await model.insertQuestionCountyScore(qname_id,questionScore,actual_score,year,countryId,indicator_id,taxonomy_id,ultimate_id,governanceId,development_id)
                                                    .then(result => {
                                                        console.log('Questions Insert result:', result.rows);
                                                        question_id = result.rows[0]['question_id'];
                                                        console.log('-------question_id--------',question_id,'-----------------');  
                                                    })
                                                    .catch(err => {
                                                        console.error('Error executing Questions query', err);
                                                    });
                                        })
                                        .catch(err => {
                                            console.error('Error executing Questions Name query', err);
                                        });

                                        // await model.insertQuestionCountyScore(questionName,questionScore,actual_score,year,countryId,indicator_id,taxonomy_id,ultimate_id,governanceId)
                                        //     .then(result => {
                                        //         console.log('Questions Insert result:', result.rows);
                                        //         question_id = result.rows[0]['question_id'];
                                        //         console.log('-------question_id--------',question_id,'-----------------');  
                                        //     })
                                        //     .catch(err => {
                                        //         console.error('Error executing Questions query', err);
                                        //     });
                                    })
                                    .catch((error) => {
                                    console.error('Error executing country query', error);
                                    });
                                }
                            }
                        })
                        .catch((error) =>{
                            console.error('Error executing indicators query', error);
                        })
                    })
                    .catch((error)=>{
                        console.error('Error executing taxonomy query', error);
                    })
                }
            })
            .catch((error)=>{
                console.error('Error executing  ultimate query', error);
            })  
        // }
    }
}


module.exports = govController;
