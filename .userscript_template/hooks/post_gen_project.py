from pathlib import Path


SEPARATE_CSS = {{cookiecutter.separate_css}}
CSS_FILE_NAME = Path('{{ cookiecutter._output_dir }}/{{ cookiecutter.slug }}/{{ cookiecutter.slug }}.user.css')

if not SEPARATE_CSS:
    CSS_FILE_NAME.unlink()
