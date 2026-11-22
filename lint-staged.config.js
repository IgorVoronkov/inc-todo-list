export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': ['oxlint --fix', 'oxfmt'],
  '*.{css,scss,html,json,jsonc,yaml,yml}': ['oxfmt'],
}
