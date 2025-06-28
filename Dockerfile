# OS - Ubuntu Based
FROM jbarlow83/ocrmypdf

# setup
RUN apt update && apt install -y \
 	# tesseract language packages
	tesseract-ocr-spa \
	poppler-utils \
	curl && \
	# clean
	apt clean && \
	apt autoremove -y

# node LTS
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
	apt purge nodejs -y && \
	apt install -y nodejs && \
	echo "Node Version:" && node -v && \
	# clean
	apt clean && \
	apt autoremove -y

# change root to home
WORKDIR /home

# set node env
ENV NODE_ENV=production

# node dependcies
COPY package.json .
RUN npm install --production

# copy app
COPY . .

# override entrypoint
ENTRYPOINT ["/usr/bin/env"]

# cmd
CMD ["node", "init.js"]