FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml README.md ./
COPY app ./app
COPY scripts ./scripts

RUN pip install --no-cache-dir .

RUN mkdir -p /app/uploads

EXPOSE 8000

CMD ["sh", "scripts/start.sh"]
