/**
 * OCR
 */

const fs    = require('fs')
const axios = require('axios')
const exec  = require('await-exec')
const pdf   = require('pdf-to-text')

const STORAGE_DIR     = 'tmp'
const SAMPLE_FILE_URL = 'https://testrs.gov.cz/smlouva/soubor/201061/non-text-searchable.pdf'

module.exports = {

	/**
	 * Init
	 * @returns {undefined}
	 */
	init() {

		try {

			// create folder if not exists
			if (!fs.existsSync(STORAGE_DIR))
				fs.mkdirSync(STORAGE_DIR)

			// any additional inital logic...
		}
		catch (e) { console.error('Ocr (init) -> exception:', e) }
	},

	/**
	 * Test request handler
	 * @returns {Promise}
	 */
	async test() {

		const file = `${STORAGE_DIR}/sample.pdf`

		// download sample file
		if (!fs.existsSync(file))
			await this.downloadFile(SAMPLE_FILE_URL, file)

		try {

			await this.process(file)

			return { status: 'ok', file }
		}
		catch (e) { return { status: 'error', message: e.toString() } }
	},

	/**
	 * OCR & Process
	 * @param {string} file - The input file path
	 * @returns {Promise}
	 */
	async process(file) {

		// exec ocrmypdf & pdftotext
		let start = new Date()

		const outputFile = file.replace('.pdf', '-ocr.pdf')

		// ocrmypdf command
		const ocrResult = await exec(`ocrmypdf -l spa --output-type pdfa --optimize 3 --skip-text ${file} ${outputFile}`, { timeout: 900000 })

		// check for ocr errors
		if (ocrResult.stderr.length && ocrResult.stderr.indexOf("ERROR") >= 0)
			console.warn(`Ocr (process) -> ocr failed for file ${file}`, ocrResult)

		console.log(`Ocr (process) -> finished OCR on ${file} in %d secs.`, (new Date() - start)/1000)

		start = new Date()

		// pdftotext command
		pdf.pdfToText(outputFile, (err, contents) => {

			try {

				if (err) throw err

				console.log(`Ocr (process) -> transpiled file ${file} in %d secs.`, (new Date() - start)/1000)
				console.log(`Ocr (process) -> file ${outputFile} processed successfully, contents:`, contents)
			}
			catch (e) {

				console.error(`Ocr (process) -> pdfToText failed on ${file}:`, e.toString())
				throw e
			}
		})
	},

	/**
	 * Download file
	 * @param {string} url - The file URL
	 * @param {string} file - The output file path
	 * @returns {Promise}
	 */
	async downloadFile(url, file) {

		console.log('Ocr (downloadFile) -> requesting file:', url)

		const writer = fs.createWriteStream(file)

		const response = await axios({ url, method: 'GET', responseType: 'stream', timeout: 30000 })

		// pipe response to writer
		response.data.pipe(writer)

		// return promise
		return new Promise((resolve, reject) => {

			writer.on('finish', resolve)
			writer.on('error', reject)
		})
	}
}
