#!/bin/bash

# Извлекаем комментарий UserScript
extract_userscript_comment() {
  local file="$1"
  sed -n '/\/\/ ==UserScript==/,/\/\/ ==\/UserScript==/p' "$file"
}

# Ваша текущая команда для поиска и сборки
for dir in userscripts/*/ ; do
  if [ -d "$dir/src" ] && [ -f "$dir/src/index.js" ]; then
    banner=$(extract_userscript_comment "$dir/src/index.js")
    ./node_modules/.bin/esbuild $dir/src/index.js --bundle --outfile=$dir/`basename $dir`.user.js --format=iife --banner:js="$banner"
  fi
done
