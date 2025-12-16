export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be lowercase and not empty
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    
    // Allowed types of commit
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'chore',
        'refactor',
        'fix',
        'docs',
        'test',
      ]
    ],

    // If scope is present, must be one of the following
    'scope-enum': [
      2,
      'always',
      ['client', 'server', 'repo', 'api', 'ui']
    ],
    
    // Description must not be empty
    'subject-empty': [2, 'never'],
  },
};