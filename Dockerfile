# OS - Ubuntu Based
FROM jbarlow83/ocrmypdf

# setup
RUN apt update && apt install -y \
 	# tesseract language packages
	tesseract-ocr-spa \
	poppler-utils curl && \
	# node LTS
	curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
	apt install -y nodejs && \
	# clean
	apt remove -y curl && \
	apt clean && \
	apt autoremove -y

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
