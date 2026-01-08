set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

requirements := "requirements.txt"

python-deps:
    uv pip install -r {{requirements}}

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

publish: build
    test -f dist/index.mjs
