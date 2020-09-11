/**
 * Init
 */

// ++ Express
const express = require('express')
const app     = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ++ OCR
const ocr = require('./ocr')

/**
 * Init
 */
async function init() {

	/**
	 * Express
	 */
	try       { await app.listen(80) }
	catch (e) { console.error("Init -> server exception", e.toString()) }

	console.log("Init -> server listening")

	/**
	 * Init OCR
	 */
	ocr.init()

	/**
	 * GET - Health check
	 */
	app.get('*/health', (req, res) => res.sendStatus(200))


	/**
	 * GET - Test
	 */
	app.get('*/test', async (req, res) => res.json(await ocr.test()))

	/**
	 * Not Found
	 */
	app.use((req, res, next) => res.status(404).send({ status: "error", "msg": "404 Not Found" }))
}

init()
