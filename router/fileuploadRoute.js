const express = require('express');
const router = express.Router();
// const app = express();
// const router = app;

const multer = require('multer');
//Upload Files
const upload = multer({
    dest: 'documents',
})

const fileController = require('../controller/fileController');
const governanceController = require('../controller/governanceController');
const countryController = require('../controller/countryController')
const overviewController = require('../controller/overviewController')


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a greeting message
 *     description: Retrieve a simple greeting message.
 *     responses:
 *       200:
 *         description: A greeting message.
 */

router.get('/', (req, resp) => {
    resp.send('Welcome to nodeJS GET API')
});

/**
 * @swagger
 * paths:
 *   /country-list:
 *     post:
 *       summary: Get data from the country table grouped by year.
 *       tags: [countries with id and years]
 *       description: Retrieve data from the country table grouped by year for the years 2021 and 2022.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: string
 *                   description: Comma-separated list of country IDs (e.g., "13,14").
 *       responses:
 *         '200':
 *           description: Successful response with data grouped by year.
 *         '400':
 *           description: Invalid input parameters.
 */
router.post('/country-list', countryController.getAllCountries);

// /**
//  * @swagger
//  * paths:
//  *   /country-list-groupby:
//  *     get:
//  *       summary: Get data from the country table grouped by year.
//  *       description: Retrieve data from the country table grouped by year for the years 2021 and 2022.
//  *       parameters:
//  *         - in: query
//  *           name: groupBy
//  *           schema:
//  *             type: string
//  *           required: true
//  *           description: Specify 'year' to group data by year.
//  *           enum: [year]
//  *       responses:
//  *         '200':
//  *           description: Successful response with data grouped by year.
//  *         '400':
//  *           description: Invalid input parameters.
//  */
// router.get('/country-list-groupby', countryController.countries_yearGroupBy);


/**
 * @swagger
 * paths:
 *   /countries-with-year:
 *     post:
 *       summary: Get data for countries with specified IDs.
 *       tags: [countries with id and years]
 *       description: Retrieve data for one or more countries based on their IDs.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countries:
 *                   type: string
 *                   description: Comma-separated list of country IDs (e.g., "13,14").
 *       responses:
 *         '200':
 *           description: Successful response with data for the specified countries.
 *         '400':
 *           description: Invalid input parameters.
 */
router.post('/countries-with-year', countryController.countries_year);


/**
 * @swagger
 * /overview:
 *   post:
 *     summary: Get all the overview,
 *     tags: [overview Data]
 *     description: Retrive all the overview.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countries:
 *                 type: string
 *                 description: Comma-separated list of country IDs (e.g., "13,14")and the governance_id
 *     responses:
 *       200:
 *         description: All the comparative-overview.
 */
router.post('/overview', overviewController.overview);

/**
 * @swagger
 * /comparative-overview:
 *   post:
 *     summary: Get all the comparative-overview,
 *     tags: [comparative-overview]
 *     description: Retrive all the comparative-overview.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countries:
 *                 type: string
 *                 description: Comma-separated list of country IDs (e.g., "13,14")and the governance_id
 *     responses:
 *       200:
 *         description: All the comparative-overview.
 */
router.post('/comparative-overview', countryController.comparative_overview);



router.post('/upload/doc', upload.single('docFile'), fileController.uploadedFile);

router.post('/upload/file', upload.single('sheetFile'), governanceController.uploadedFile);

module.exports = router;
































// /**
//  * @swagger
//  * /countries-with-year:
//  *   get:
//  *     summary: Get data for countries with specified IDs with years.
//  *     tags: [Countries by years]
//  *     description: Retrieve data for one or more countries based on their IDs.
//  *     requestBody: {
//  *          content: {
//  *              application/json: {
//  *              schema: {
//  *                   type: "object",
//  *                   properties: {
//  *                       countries: {
//  *                          description: "The Countries name",
//  *                          required: true,
//  *                          type: "integer",
//  *                          example: "Countries"
//  *                       }
//  *                   }
//  *              }
//  *              }
//  *          }
//  *     }
//  *     responses:
//  *       200:
//  *         description: Successful response with data for the specified countries.
//  */