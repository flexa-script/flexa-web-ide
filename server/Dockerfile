# Usa uma imagem leve do Ubuntu
FROM ubuntu:22.04

# Instala dependências (ajuste conforme necessário)
RUN apt-get update && apt-get install -y \
  libstdc++6 \
  && apt-get clean

# Cria diretório de trabalho
WORKDIR /app

# Copia tudo da pasta interpreter para dentro do container
COPY interpreter/ /app/interpreter/

# Adiciona permissão de execução ao binário
RUN chmod +x /app/interpreter/flexa

# Comando padrão (pode ser substituído no docker run)
ENTRYPOINT ["/app/interpreter/flexa"]
