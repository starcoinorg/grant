module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-prettier/recommended'],
  rules: {
    // fixed Unexpected unknown pseudo-element selector "::v-deep"
    // Unexpected unknown pseudo-class selector ":export" (selector-pseudo-class-no-unknown)
    // @see https://github.com/bencodezen/vue-enterprise-boilerplate/issues/190
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep','export']
      }
    ],
    // Override all options of `prettier` here
    // @see https://prettier.io/docs/en/options.html
    'prettier/prettier': [
      true,
      {
        printWidth: 160,
        singleQuote: true,
        indentation: 2
      }
    ]
  }
}
