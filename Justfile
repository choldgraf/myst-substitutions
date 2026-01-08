set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

requirements := "requirements.txt"
venv := ".venv"
venv_bin := "{{venv}}/bin"
python := "{{venv_bin}}/python"

export PATH := "{{venv_bin}}:{{env_var('PATH')}}"

venv:
    uv venv {{venv}}

python-deps: venv
    uv pip install -r {{requirements}} --python {{python}}

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
