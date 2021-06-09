/**
 * OCR
 */

const fs    = require('fs')
const axios = require('axios')
const exec  = require('await-exec')
const pdf   = require('pdf-to-text')

const STORAGE_DIR     = 'storage'
const SAMPLE_FILE_URL = 'https://idrh.ku.edu/sites/idrh.ku.edu/files/files/tutorials/pdf/Non-text-searchable.pdf'

module.exports = {

	/**
	 * Init
	 */
	init() {

		// create folder if not exists
		if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR)

		// any additional inital logic...
	},

	/**
	 * Test request handler
	 */
	async test() {

		const file = `${STORAGE_DIR}/sample.pdf`

		// download sample file
		if (!fs.existsSync(file)) await this.downloadFile(SAMPLE_FILE_URL, file)

		try {

			await this.process(file)

			return { status: "ok", file }
		}
		catch (e) { return { status: "error", message: e.toString() } }
	},

	/**
	 * OCR & Process
	 */
	async process(file) {

		// exec ocrmypdf & pdftotext
		try {

			let start = new Date()

			const outputFile = file.replace('.pdf', '-ocr.pdf')

			// ocrmypdf command
			const ocrResult = await exec(`ocrmypdf -l spa --output-type pdfa --optimize 3 --skip-text ${file} ${outputFile}`, { timeout: 900000 })

			// check for ocr errors
			if (ocrResult.stderr.length && ocrResult.stderr.indexOf("ERROR") >= 0) console.info(`ocr failed for ${file}`, ocrResult)

			console.log(`Ocr (process) -> finished OCR on ${file} in %d secs.`, (new Date() - start)/1000)

			start = new Date()

			// pdftotext command
			pdf.pdfToText(outputFile, (err, contents) => {

				try {

					if (err) throw err

					console.log(`Ocr (process) -> transpiled file ${file} in %d secs.`, (new Date() - start)/1000)

					console.log(`Ocr (process) -> File ${outputFile} processed successfully. Contents:`)
					console.log(contents)
				}
				catch (e) { console.error(`Ocr (process) -> pdfToText failed on ${file}:`, e.toString()); throw e }
			})
		}
		catch (e) { throw e }
	},

	/**
	 * Download file
	 */
	async downloadFile(url, file) {

		console.log("Ocr (downloadFile) -> requesting file: ", url)

		const writer = fs.createWriteStream(file)

		const response = await axios({ url, method: 'GET', responseType: 'stream', timeout: 30000 })

		response.data.pipe(writer)

		return new Promise((resolve, reject) => {

			writer.on('finish', resolve)
			writer.on('error', reject)
		})
	}
}
