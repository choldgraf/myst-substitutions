set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

requirements := "requirements.txt"
venv := ".venv"

python-deps:
    uv venv {{venv}}
    uv pip install -r {{requirements}} --python {{venv}}/bin/python

node-deps:
    npm install

build: node-deps
    npm run build

test: python-deps node-deps
    npm test

docs: python-deps build
    cd docs && myst build --html

docs-live: python-deps build
    cd docs && myst start
