FROM denoland/deno:alpine-1.46.3

WORKDIR /app
COPY . .

RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-env", "main.ts"]
