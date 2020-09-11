node-ocr
========

NodeJs v.12 + [OcrMyPdf](https://github.com/jbarlow83/OCRmyPDF) Docker Image, [based on Ubuntu image](https://github.com/jbarlow83/OCRmyPDF/blob/master/.docker/Dockerfile). Developed for custom OCR node APIs or workers.

## Usage

Run Container [port **8080**]
```sh
docker run -p 8080:80 -d npulidom/node-ocr
```

Test OCR
```curl
curl - http://localhost:8080/test
```

### Dockerfile for building

```docker
# latest tag
FROM npulidom/node-ocr

# change root to home
WORKDIR /home

# node dependcies
COPY package.json .
RUN npm install -g pm2 && \
	npm install --production

# copy app
COPY . .

# override entrypoint
ENTRYPOINT ["/usr/bin/env"]

# start
CMD pm2-runtime init.js
```
