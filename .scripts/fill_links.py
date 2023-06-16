#! /usr/bin/env python3
import re
from dataclasses import dataclass
from pathlib import Path

RAW_REPOSITORY = "https://github.com/ilyachch/userscripts/raw/main/"

SCRIPTS = 'scripts'
STYLES = 'styles'

ROOT_FOLDER = Path(__file__).parent.parent

FOLDERS_TO_PARSE_BY_TYPE = {
    SCRIPTS: ROOT_FOLDER / Path('userscripts'),
    STYLES: ROOT_FOLDER / Path('usercss'),
}
MARKERS_BY_TYPE = {
    SCRIPTS: (
        '<!-- start_scripts_links -->',
        '<!-- end_scripts_links -->',
    ),
    STYLES: (
        '<!-- start_styles_links -->',
        '<!-- end_styles_links -->',
    ),
}
README_FILE = ROOT_FOLDER / Path('README.md')


@dataclass
class Style:
    name: str
    link: str
    version: str

    @classmethod
    def from_file(cls, file_: Path):
        file_content = file_.read_text()
        name = re.search(r'@name\s+(\w.+)', file_content).group(1)
        link = re.search(r'@updateURL\s+(\w.+)', file_content).group(1)
        version = re.search(r'@version\s+(\w.+)', file_content).group(1)
        return cls(name, link, version)


@dataclass
class Script:
    name: str
    link: str
    version: str

    @classmethod
    def from_file(cls, file_: Path):
        file_content = file_.read_text()
        name = re.search(r'// @name\s+(\w.+)', file_content).group(1)
        link = re.search(r'// @updateURL\s+(\w.+)', file_content).group(1)
        version = re.search(r'// @version\s+(\w.+)', file_content).group(1)
        return cls(name, link, version)


def parse_styles() -> list[Style]:
    styles = []
    files_to_parse = FOLDERS_TO_PARSE_BY_TYPE[STYLES].glob('**/*.user.css')
    for file_ in files_to_parse:
        styles.append(Style.from_file(file_))
    styles.sort(key=lambda x: x.name)
    return styles


def parse_scripts() -> list[Script]:
    scripts = []
    files_to_parse = FOLDERS_TO_PARSE_BY_TYPE[SCRIPTS].glob('**/*.user.js')
    for file_ in files_to_parse:
        scripts.append(Script.from_file(file_))
    scripts.sort(key=lambda x: x.name)
    return scripts


def main():
    styles = parse_styles()
    scripts = parse_scripts()

    data = {
        SCRIPTS: scripts,
        STYLES: styles,
    }

    for type_ in (SCRIPTS, STYLES):
        items = data[type_]
        start_marker, end_marker = MARKERS_BY_TYPE[type_]
        content = README_FILE.read_text()
        # replace <start_market>...<end_marker> with <start_marker>\n<end_marker>\n
        content = re.sub(
            f'{start_marker}.*{end_marker}',
            f'{start_marker}\n{end_marker}',
            content,
            flags=re.DOTALL,
        )
        # replace <start_marker>\n<end_marker>\n with <start_marker>\n<links>\n<end_marker>\n
        links = '\n'.join(f'* [{item.name}]({item.link}) - {item.version}' for item in items)
        content = re.sub(
            f'{start_marker}\n{end_marker}',
            f'{start_marker}\n{links}\n{end_marker}',
            content,
        )
        README_FILE.write_text(content)

if __name__ == '__main__':
    main()
