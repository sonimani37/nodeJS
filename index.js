let express = require('express');
let app = express();
app.use(express.json());  //it's going to automatically  parse incoming JSON to an object(at the time of inserting or data fetching from the frontend)
const bodyParser = require('body-parser')
app.use(bodyParser.json());
const cors = require('cors')
app.use(cors())

const router = require('./router/fileuploadRoute');
app.use("/api", router);

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
    definition: {
      openapi: '3.0.0', // Specify the OpenAPI version
      info: {
        title: 'nodeJS API', // Replace with your API name
        version: '1.0.0', // Replace with your API version
        description: 'API documentation for my Express application',
      },

      servers:[
        { 
            url:'http://localhost:5000/api'
        }
      ]
    },
    // Specify the paths to your API endpoints
    apis: ['./router/*.js'], // Replace with the path to your route files
  };
  
  const swaggerSpec = swaggerJsdoc(options);

  // Serve Swagger UI and documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));







// app.post('/upload/doc', upload.single('docFile'),async (req, res) => {
//     console.log(req.body.country_id);
//     var country_id = req.body.country_id;
//     const uploadedFile = req.file;
//     if (!uploadedFile) {
//         return res.status(400).send('No file uploaded.');
//     }
//    // Read and process the uploaded Excel file
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
//                                         //         const questionText = data[i].Questions;
//                                         //         const actualScoreMatch = questionText.match(/\((\d+)\)/);
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
// });


app.listen(5000, () => {
    console.log('Server is up on the Port 5000');
})