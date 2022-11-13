.PHONY=all

_check_cookiecutter_exists:
	@which cookiecutter > /dev/null || (echo "cookiecutter is not installed. Please install it first." && exit 1)

user_style: _check_cookiecutter_exists
	@cookiecutter .usercss_template -o usercss

user_script: _check_cookiecutter_exists
	@cookiecutter .userjs_template -o userscript
