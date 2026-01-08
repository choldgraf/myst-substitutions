requirements := "requirements.txt"
root := justfile_directory()
venv := root + "/.venv"
venv_bin := venv + "/bin"
python := venv_bin + "/python"
myst := venv_bin + "/myst"

venv:
    uv venv {{venv}}

python-deps: venv
    uv pip install -r {{requirements}} --python {{python}}

node-deps:
    npm install

build: node-deps
    npm run build

test: python-deps node-deps
    PATH="{{venv_bin}}:$PATH" npm test

docs: python-deps build
    cd docs && {{myst}} build --html

docs-live: python-deps build
    cd docs && {{myst}} start
