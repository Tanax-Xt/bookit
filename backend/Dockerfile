FROM python:3.12

COPY requirements requirements

RUN pip install -r requirements/prod.txt

COPY . .

CMD sh -c "alembic upgrade head && uvicorn src.app:app --host $APP_HOST --port $APP_PORT"
