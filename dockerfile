FROM node:20-alpine

# Instalar prisma globalmente
RUN yarn global add prisma

# Instalar rsync
RUN apk --no-cache add rsync

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o arquivo .env para o contêiner
COPY .env /app/.env

# Copiar os arquivos package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalar as dependências
RUN yarn install

# Inicializar o Prisma e puxar o esquema do banco de dados
RUN npx prisma init
RUN npx prisma db pull

# Copiar o restante do código para o contêiner
COPY . .

# Usar rsync para copiar arquivos, excluindo a pasta prisma
RUN rsync -a --exclude='prisma' /app/ /app_temp/

# Gerar os artefatos do Prisma
RUN npx prisma generate

# Construir a aplicação
RUN yarn build

# Expor a porta necessária
EXPOSE 3535

# Definir o comando padrão para iniciar a aplicação
CMD ["yarn", "start:prod"]
