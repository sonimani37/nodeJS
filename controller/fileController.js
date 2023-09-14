
const xlsx = require('xlsx');
const model = require('../models/fileUploadModel');

let fileController = {};

fileController.uploadedFile = async (req, resp) => {
    try{
        const countryId = req.body.country_id;
        const uploadedFile = req.file;
        const year = req.body.year;
        // console.log(uploadedFile);
        // console.log(countryId);
        if (!uploadedFile) {
          return resp.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.readFile(uploadedFile.path);
        // for (const sheetName of workbook.SheetNames) {
            console.log( workbook.SheetNames);
        for (const [index, sheetName] of workbook.SheetNames.entries()) {
                console.log('------------index-------',index);
                console.log('------------sheetName-------',sheetName);
                const governance_id = index == 0 ? 1 : 2;
                console.log('-------------------governance_id---------------------',governance_id);
                // if(index == 1){
                    const sheet = workbook.Sheets[sheetName];
                    const sheetData = xlsx.utils.sheet_to_json(sheet);
                    await processSheet(sheetName, sheetData, governance_id, countryId,year,index);
                // }
        }
        resp.send('POST request received');

    }catch(error){
        console.log(error);
    }
}

async function processSheet(sheetName, sheetData, governanceId, countryId,year,index) {
    // console.log(sheetName);
    // console.log(governanceId);
    // console.log(countryId);
    // console.log(year);
    // console.log(sheetData.length);
    allTaxonomy = ['Healthcare Governance','IT Governance','IT Workforce & Infrastructure',
        'Healthcare workforce and Infrastructure','AI Workforce/Infrastructure',
        'Digital Health (DH) Governance','DH Infrastructure','Workforce (Technical and Health care)',
        'Funding and resources','Legal rules','Research Program and funding',
        'Literacy (patient+ workforce)'];

    for (let i = 0; i < sheetData.length; i++) {
        // if (i == 0 ||i == 50 ||i == 93|| i == 178 || i == 87 || i == 122) {
        // if (i == 0  ||i == 50 ||i == 93|| i == 178 || i == 87 || i == 122) {
        // if ( i < 4) {
            console.log('---------------------------------------start---------------------------------------',i);
            const data = sheetData[i];
            if(data.Ultimate != undefined){
                console.log(data);
                const ultimateName = data?.Ultimate?.toLowerCase().trimEnd();
                var taxonomyName = data?.Taxonomy?.trimEnd();
                // console.log('before taxonomyName--------',taxonomyName);
                var taxonomyScore;
                if (typeof taxonomyName === 'string'){
                    const taxoScoreMatch = taxonomyName?.match(/\((\d+)\)/);
                    taxonomyScore = taxoScoreMatch ? parseInt(taxoScoreMatch[1]) : null;
                    // console.log(taxonomyScore);
                }
                var indicatorName = data.Indicators?.trimEnd();
                console.log('----before indicatorName----',indicatorName);
                var indicatorScore;
                if (typeof indicatorName === 'string'){
                    const indicScoreMatch = indicatorName?.match(/\((\d+)\)/);
                    indicatorScore = indicScoreMatch ? parseInt(indicScoreMatch[1]) : null;

                    const inputString = indicatorName;
                    indicatorName = inputString.replace(/\(\d+\)/, "").trim();
                    console.log('after indicatorName',indicatorName);
                    // console.log(indicatorScore);
                }
                var questionName = data.Questions?.trimEnd();
                var questionScore;
                console.log('before questionName',questionName);
                if (typeof questionName === 'string'){
                    const actualScoreMatch = questionName?.match(/\((\d+)\)/);
                    questionScore = actualScoreMatch ? parseInt(actualScoreMatch[1]) : null;

                    const inputString = questionName;
                    questionName = inputString.replace(/\(\d+\)/, "").trim();
                    console.log('after questionName',questionName);
                    // console.log(questionScore);
                }
                const actualScore =  data['Actual Score'];
                const status =  data.Status;
                const text =  data.Text;
                const links =  data.Links;

                await model.getUltimateByName(ultimateName)
                .then(async (result) =>{
                    const ultimate_id = result.rows[0]?.['ultimate_id'];
                    const development_id = result.rows[0]?.['development_id'];
                    // console.log('-----------ultimate data----------',result.rows[0],'-----------------');
                    console.log('-----------ultimate_id----------',ultimate_id,'-----------------');
                    var newTaxonomyName;
                        const filteredTaxonomy = await allTaxonomy.filter((taxonomy) =>
                        taxonomyName.includes(taxonomy)
                        );
                        if(filteredTaxonomy){
                            newTaxonomyName = filteredTaxonomy[0];
                        }
                        if(newTaxonomyName != undefined){
                            console.log('new----- taxonomyName--------',newTaxonomyName)
                            await model.selectTaxonomy(newTaxonomyName)
                            .then(async (result) =>{
                                var taxonomy_id;
                                if(result?.rows?.length > 0){
                                    // console.log('Taxonomy Select result:', result.rows);
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
                                // console.log('IndicatorsName--------',indicatorName);
                                // console.log('indicatorScore--------------',indicatorScore);
                                await model.getIndicatorByName(indicatorName)
                                .then(async (result) =>{
                                    var indicator_id;
                                    if(result?.rows?.length > 0){
                                        // console.log('Indicators Select result:', result.rows);
                                        indicator_id = result.rows[0].indicator_id;
                                        console.log('-------indicator_id--------',indicator_id,'-----------------');  
                                        console.log('----------Indicators--taxonomy_id----------',taxonomy_id,'-----------------');
                
                                    }else{
                                        console.log('Indicators Insert result:', indicatorName);
                                        console.log('----------Indicators--taxonomy_id----------',taxonomy_id,'-----------------');
                                        await model.insertIndicator(indicatorName, taxonomy_id,indicatorScore)
                                        .then((result) =>{
                                                console.log('Indicators Insert result:', result.rows);
                                                indicator_id = result.rows[0]['indicator_id'];
                                                console.log('-------indicator_id--------',indicator_id,'-----------------');
                                        }).catch((err) => {
                                                console.error('Error executing indicator_id query', err);
                                        });
                                    } 
                                  
                                    console.log('----country_id---',parseInt(countryId));
                                    console.log('year-------',parseInt(year));
                                    if( index == 0 && i == 0){
                                        console.log('-----------i------',i);
                                        await model.selectCountryById(parseInt(countryId),parseInt(year))
                                        .then(async result => {
                                            // console.log('result.rows[0]',result.rows[0]);
                                            const countryIdCount = parseInt(result.rows[0].count);
                                            console.log('countryIdCount---', countryIdCount);
                                            if (countryIdCount > 0) {
                                                console.log(`Country ID ${countryId} exists in the question_table.`);
                                                // await model.selectQname(countryId,year)
                                                // .then( async result =>{
                                                //     console.log(result.rowCount);
                                                //     let qnameArray = result.rows;
                                                //     console.log(qnameArray);
                                                //     qnameArray.forEach(async (element) => {
                                                //         console.log('element',element);
                                                //         await model.deleteQnameByID(element.qname_id)
                                                //         .then(result =>{
                                                //             console.log(result);
                                                //         })
                                                //         .catch(error =>{
                                                //             console.log('error',error);
                                                //         })
                                                //     });
                                                //      await model.deleteCountryIdQuestions(countryId,year)
                                                //         .then(async result => {
                                                //             console.log(result);
                                                //             console.log('Questions deleted result:', result.rowCount);
                                                //         })
                                                //         .catch(err => {
                                                //             console.error('Error executing Questions deleted query', err);
                                                //         });
                                                // })
                                                // .catch(result => {
                                                //     console.log('QuestionName SELECTED result:', result.rowCount);
                                                // })
                                                await model.deleteCountryIdQuestions(countryId,year)
                                                .then(async result => {
                                                    console.log(result);
                                                    console.log('Questions deleted result:', result.rowCount);
                                                })
                                                .catch(err => {
                                                    console.error('Error executing Questions deleted query', err);
                                                });
                                            } else {
                                                console.log(`Country ID ${countryId} does not exists in the question_table.`);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error executing Question Select query', error);
                                        });     
                                    }
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
                                            // console.log('qname_id--------------',qname_id);
                                            // console.log('questionScore--------',questionScore);
                                            // console.log('governanceId--------------',governanceId);   
                                            // console.log('ultimate_id--------------',ultimate_id);   
                                            // console.log('development_id--------------',development_id);   
                                            // console.log('taxonomy_id--------------',taxonomy_id);   
                                            // console.log('indicator_id--------------',indicator_id);   
                                            // console.log('countryId--------------',countryId);   
                                            // console.log('year-------',parseInt(year));
                                            // console.log('Actual Score-------',actualScore);
                                            // console.log('status-------',status);
                                            // console.log('text-------',text);
                                            // console.log('links links-------',links);
                                        await model.insertQuestion(qname_id,questionScore,actualScore,year,countryId,indicator_id,taxonomy_id,ultimate_id,status,text,links,governanceId,development_id)
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
            }   
        // }
    }
}


module.exports = fileController;



// async function uploadedFile(req, res) {
//     console.log(req.body.country_id);
//     var country_id = req.body.country_id;
//     const uploadedFile = req.file;
//     if (!uploadedFile) {
//         return res.status(400).send('No file uploaded.');
//     }

//     // Read and process the uploaded Excel file
//     const workbook = xlsx.readFile(uploadedFile.path);
//     console.log(workbook.SheetNames);
//     workbook.SheetNames.forEach(async (element,index) => {

//         // const sheetName = workbook.SheetNames[1];
//         // if(index == 0){
//             console.log(element);
//             const sheetName = element;
//             const governance_id = index == 0 ? 1 : 2;
//             console.log('-----------------------------------------------------governance_id------------',governance_id,'-----------------');
//             const sheet = workbook.Sheets[sheetName];
//             const data = xlsx.utils.sheet_to_json(sheet);
//             console.log(data.length);
//             //  console.log(data);
//             for(let i = 0; i < data.length;i++){
//                 // console.log(data[0]);
//                 // console.log(data[i].Ultimate, "====",data[i].Indicators);
//                 // if(i <= 178){
//                 if(i == 50 || i == 173 ||i == 175 || i == 176 || i == 177 || i == 244 || i == 214){
//                     if(data[i].Ultimate != undefined){
//                         console.log('------------------------------------------------------------start----------------------------',i);
//                         console.log(data[i]);
//                         // console.log(data[i].Ultimate.toLowerCase());
//                         const ultimateName = (data[i].Ultimate.toLowerCase()).trimEnd();
//                         console.log(ultimateName);
//                         const ulti_query =  { text: 'SELECT * FROM ultimate WHERE ultimate_name = $1', values: [ultimateName]};
//                        await client.query(ulti_query)
//                             .then(async result => {
//                                 // console.log('ultimate SELECT result:', result)
//                                 console.log('ultimate SELECT result:', result.rows)
//                                 var ultimate_id = result.rows[0]?.['ultimate_id'];
//                                 console.log('-----------ultimate_id----------',ultimate_id,'-----------------');
//                                 // console.log(data[i].Taxonomy);
//                                 console.log((data[i].Taxonomy).trimEnd());
//                                 const taxonomyName = data[i].Taxonomy.trimEnd();
//                                 const taxo_select = { text: 'SELECT * FROM taxonomy WHERE taxonomy_name = $1', values: [taxonomyName]};
//                                 await client.query(taxo_select)
//                                     .then(async result => {
//                                         var taxonomy_id;
//                                         if(result?.rows?.length > 0){
//                                             console.log('Taxonomy Select result:', result.rows);
//                                             taxonomy_id = result.rows[0].taxonomy_id;
//                                             console.log('-------taxonomy_id--------',taxonomy_id,'-----------------');
//                                         }else{
//                                             console.log('Taxonomy Insert result:', taxonomyName);
//                                             console.log('----------Taxonomy--ultimate_id----------',ultimate_id,'-----------------');
//                                             //     const taxo_insert = {
//                                             //         text: 'INSERT INTO taxonomy (taxonomy_name, ultimate_id, governance_id) VALUES ($1, $2, $3) RETURNING taxonomy_id',
//                                             //         values: [taxonomyName, ultimate_id, governance_id],
//                                             //     };
//                                             //    await client.query(taxo_insert)
//                                             //     .then(result => {
//                                             //         console.log('Taxonomy Insert result:', result.rows);
//                                             //         taxonomy_id = result.rows[0]['taxonomy_id'];
//                                             //         console.log('-------taxonomy_id--------',taxonomy_id,'-----------------');
//                                             //     })
//                                             //     .catch(err => {
//                                             //         console.error('Error executing Taxonomy query', err);
//                                             //     });
//                                         }
//                                         // console.log(data[i].Indicators);
//                                         // const indic_select = { text: 'SELECT * FROM indicators WHERE indicator_name = $1', values: [data[i].Indicators]};
//                                         // await client.query(indic_select)
//                                         //     .then(async result => {
//                                         //         var indicator_id;
//                                         //         if(result?.rows?.length > 0){
//                                         //             console.log('Indicators Select result:', result.rows);
//                                         //             indicator_id = result.rows[0].indicator_id;
//                                         //         console.log('-------indicator_id--------',indicator_id,'-----------------');  
//                                         //         }else{
//                                         //             console.log('Indicators Insert result:', result.rows);
//                                         //             const indic_insert = {
//                                         //                 text: 'INSERT INTO indicators (indicator_name, taxonomy_id) VALUES ($1, $2) RETURNING indicator_id',
//                                         //                 values: [data[i].Indicators, taxonomy_id],
//                                         //             };
//                                         //            await client.query(indic_insert)
//                                         //             .then(result => {
//                                         //                 console.log('Indicators Insert result:', result.rows);
//                                         //                 indicator_id = result.rows[0]['indicator_id'];
//                                         //                 console.log('-------indicator_id--------',indicator_id,'-----------------');  
//                                         //             })
//                                         //             .catch(err => {
//                                         //                 console.error('Error executing Indicators query', err);
//                                         //             });
//                                         //         }

//                                         //         console.log('Questions Insert :---------');
//                                         //         const questionName = data[i].Questions;
//                                         //         const actualScoreMatch = questionName.match(/\((\d+)\)/);
//                                         //         const questionScore = actualScoreMatch ? parseInt(actualScoreMatch[1]) : null;
//                                         //         console.log('questionScore--------',questionScore);
//                                         //         console.log('----country_id---',country_id);
//                                         //         console.log('Actual Score-------',data[i]['Actual Score']);

//                                         //         if( i == 0){
//                                         //             const quest_select = {text: 'SELECT COUNT(*) FROM questions WHERE country_id = $1',values: [country_id] };
//                                         //             await client.query(quest_select)
//                                         //             .then(async result => {
//                                         //                 console.log(result);
//                                         //                 const countryIdCount = parseInt(result.rows[0].count);
//                                         //                 if (countryIdCount > 0) {
//                                         //                     console.log(`Country ID ${country_id} exists in the question_table.`);
//                                         //                     //   Delete existing data for the country_id
//                                         //                     const deleteQuery = {
//                                         //                         text: 'DELETE FROM questions WHERE country_id = $1',
//                                         //                         values: [country_id]
//                                         //                     };
//                                         //                     await client.query(deleteQuery)
//                                         //                     .then(async result => {
//                                         //                         console.log('Questions deleted result:', result.rows);
//                                         //                     })
//                                         //                     .catch(err => {
//                                         //                         console.error('Error executing Questions deleted query', err);
//                                         //                     });

//                                         //                 } else {
//                                         //                     console.log(`Country ID ${country_id} does not exists in the question_table.`);
//                                         //                 }
//                                         //             })
//                                         //             .catch(err => {
//                                         //                 console.error('Error executing Question Select query', err);
//                                         //             });     
//                                         //         }

//                                         //         const quest_insert = {
//                                         //             text: 'INSERT INTO questions (question_name, actual_score,status,text,links,indicator_id,country_id,question_score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING question_id',
//                                         //             values: [data[i].Questions, data[i]['Actual Score'],data[i].Status,data[i].Text,data[i].Links,indicator_id,country_id,questionScore],
//                                         //         };
//                                         //         await client.query(quest_insert)
//                                         //         .then(result => {
//                                         //             console.log('Questions Insert result:', result.rows);
//                                         //             question_id = result.rows[0]['question_id'];
//                                         //             console.log('-------question_id--------',question_id,'-----------------');  
//                                         //         })
//                                         //         .catch(err => {
//                                         //             console.error('Error executing Questions query', err);
//                                         //         });
                                                
//                                         //         // const quest_select = {text: 'SELECT COUNT(*) FROM questions WHERE country_id = $1',values: [country_id] };
//                                         //         // await client.query(quest_select)
//                                         //         //     .then(async result => {
//                                         //         //         console.log(result);
//                                         //         //         const countryIdCount = parseInt(result.rows[0].count);

//                                         //         //         if (countryIdCount > 0) {
//                                         //         //             console.log(`Country ID ${country_id} exists in the question_table.`);
//                                         //         //             //   Delete existing data for the country_id
//                                         //         //             const deleteQuery = {
//                                         //         //                 text: 'DELETE FROM questions WHERE country_id = $1',
//                                         //         //                 values: [country_id]
//                                         //         //             };
//                                         //         //             await client.query(deleteQuery)
//                                         //         //             .then(async result => {
//                                         //         //                 console.log('Questions deleted result:', result.rows);
//                                         //         //                 console.log('questionScore--------',questionScore);
//                                         //         //                 console.log('----country_id---',country_id);
//                                         //         //                 console.log('Actual Score-------',data[i]['Actual Score']);
//                                         //         //                 const quest_insert = {
//                                         //         //                     text: 'INSERT INTO questions (question_name, actual_score,status,text,links,indicator_id,country_id,question_score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING question_id',
//                                         //         //                     values: [data[i].Questions, data[i]['Actual Score'],data[i].Status,data[i].Text,data[i].Links,indicator_id,country_id,questionScore], };
//                                         //         //                     await client.query(quest_insert)
//                                         //         //                     .then(result => {
//                                         //         //                         console.log('Questions Insert after deleted result:', result.rows);
//                                         //         //                         question_id = result.rows[0]['question_id'];
//                                         //         //                         console.log('-------question_id--------',question_id,'-----------------');  
//                                         //         //                     })
//                                         //         //                     .catch(err => {
//                                         //         //                         console.error('Error executing Questions query', err);
//                                         //         //                     }); 
//                                         //         //             })
//                                         //         //             .catch(err => {
//                                         //         //                 console.error('Error executing Questions deleted query', err);
//                                         //         //             });

//                                         //         //         } else {
//                                         //         //             console.log(`Country ID ${country_id} does not exist in the question_table.`);
//                                         //         //             console.log('Questions Insert result:', result.rows);
//                                         //         //             console.log('questionScore--------',questionScore);
//                                         //         //             console.log('----country_id---',country_id);
//                                         //         //             console.log('Actual Score-------',data[i]['Actual Score']);
//                                         //         //             const quest_insert = {
//                                         //         //             text: 'INSERT INTO questions (question_name, actual_score,status,text,links,indicator_id,country_id,question_score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING question_id',
//                                         //         //             values: [data[i].Questions, data[i]['Actual Score'],data[i].Status,data[i].Text,data[i].Links,indicator_id,country_id,questionScore], };
//                                         //         //             await client.query(quest_insert)
//                                         //         //             .then(result => {
//                                         //         //                 console.log('Questions Insert result:', result.rows);
//                                         //         //                 question_id = result.rows[0]['question_id'];
//                                         //         //                 console.log('-------question_id--------',question_id,'-----------------');  
//                                         //         //             })
//                                         //         //             .catch(err => {
//                                         //         //                 console.error('Error executing Questions query', err);
//                                         //         //             });
//                                         //         //         }
//                                         //         //             // const quest_insert = {
//                                         //         //             //     text: 'INSERT INTO questions (question_name, actual_score,status,text,links,indicator_id,country_id,question_score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING question_id',
//                                         //         //             //     values: [data[i].Questions, data[i]['Actual Score'],data[i].Status,data[i].Text,data[i].Links,indicator_id,country_id,questionScore],
//                                         //         //             // };
//                                         //         //             // await client.query(quest_insert)
//                                         //         //             // .then(result => {
//                                         //         //             //     console.log('Questions Insert result:', result.rows);
//                                         //         //             //     question_id = result.rows[0]['question_id'];
//                                         //         //             //     console.log('-------question_id--------',question_id,'-----------------');  
//                                         //         //             // })
//                                         //         //             // .catch(err => {
//                                         //         //             //     console.error('Error executing Questions query', err);
//                                         //         //             // });
//                                         //         //     })
//                                         //         //     .catch(err => {
//                                         //         //         console.error('Error executing Question Select query', err);
//                                         //         //     });                             
//                                         //     })
//                                         //     .catch(err => {
//                                         //         console.error('Error executing indicators query', err);
//                                         //     });
//                                     })
//                                     .catch(err => {
//                                         console.error('Error executing taxonomy query', err);
//                                     });
//                             })
//                             .catch(err => {
//                                 console.error('Error executing  ultimate query', err);
//                             });
//                     }
//                 }
//             }
//         // }
       
//     })
//     res.send('Excel file uploaded and processed.');
// }
