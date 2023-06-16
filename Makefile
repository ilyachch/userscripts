.PHONY=all

COOKIECUTTERRC = .cookiecutterrc

_check_cookiecutter_exists:
	@which cookiecutter > /dev/null || (echo "cookiecutter is not installed. Please install it first." && exit 1)

user_style: _check_cookiecutter_exists
	@COOKIECUTTER_CONFIG=$(COOKIECUTTERRC) cookiecutter .usercss_template -o usercss

simple_user_style: _check_cookiecutter_exists
	@test -n "$(name)" || (echo "name is not provided. Please provide it." && exit 1)
	@COOKIECUTTER_CONFIG=$(COOKIECUTTERRC) cookiecutter .usercss_template -o usercss --no-input name=$(name)

user_script: _check_cookiecutter_exists
	@COOKIECUTTER_CONFIG=$(COOKIECUTTERRC) cookiecutter .userscript_template -o userscripts

readme:
	@python3 .scripts/fill_links.py
