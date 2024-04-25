FROM python:3.10-slim-buster

WORKDIR /python-docker

RUN python3 -m venv .venv
RUN pip3 install Flask openai paramiko python-dotenv gunicorn

COPY . .

EXPOSE 8000

CMD [ "gunicorn", "-w" , "4", "-b", "0.0.0.0", "app:app"]