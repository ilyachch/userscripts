.PHONY=all

COOKIECUTTERRC = .cookiecutterrc

_check_cookiecutter_exists:
	@which cookiecutter > /dev/null || (echo "cookiecutter is not installed. Please install it first." && exit 1)

user_style: _check_cookiecutter_exists
	@COOKIECUTTER_CONFIG=$(COOKIECUTTERRC) cookiecutter .usercss_template -o usercss

user_script: _check_cookiecutter_exists
	@COOKIECUTTER_CONFIG=$(COOKIECUTTERRC) cookiecutter .userscript_template -o userscripts
