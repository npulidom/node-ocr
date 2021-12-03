node-ocr
========

`NodeJs` + [OcrMyPdf](https://github.com/jbarlow83/OCRmyPDF) + `pdftotext` Docker Image, [based on Ubuntu image](https://github.com/jbarlow83/OCRmyPDF/blob/master/.docker/Dockerfile). Developed for custom OCR node APIs or workers.

## Usage

Run Container [port **8080**]
```sh
docker run -p 8080:80 -d npulidom/node-ocr
```

Test OCR
```curl
curl -i http://localhost:8080/test
```

### Dockerfile for building

```docker
# latest tag
FROM npulidom/node-ocr

# node dependcies
COPY package.json .
RUN npm install --production

# copy app
COPY . .

# pm2 starts init.js automatically
```
