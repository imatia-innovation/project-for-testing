## First steps to config project before init:

### 1\. Get in the directory and install dependencies:

```plaintext
cd packar/
npm install
```

### 2\. Environment Vars

example.env File shows the names (without values) of the environment variables that must be used to run the tests in the .env file

### 3\. Coding

This project is based on typecript code and playwritght framework to execute tests.

The directory structure:

*   classes: Some utils with complex behavior as specific data mappers or functions to determine a behavior to execute tests.
*   constants: Specific texts (on spanish) that are found in the Packar web platform.
*   core: This is a try to integrate with the API functionallities for clean or mock data, or use a kind of strategy to set conditions after/before run tests (but is no finished).
*   functions:
    *   steps: compressed functions, they are directly related to tests cases and bussiness logic.
    *   utils: generic functions, that can be reused in many tests cases, because the have a generic behavior.
*   interfaces: just for typing objects used on the code.
*   tests: Here are the tests cases, by page section on the Packar web platform.

Configurations files:

*   .eslintrc: related to format text code with

```plaintext
npm run format
```

*   .gitignore
*   .prettierrc: related to format text code with .eslintrc
*   constants: some values changes between environments, so here are the mapped environment variables.
*   example.env: example of the .env file values
*   package.json
*   playwright.config.ts
*   tsconfig.json

## Testing!

### Get in the directory

```plaintext
cd packar/
```

### Run all tests

```plaintext
npm run test
```

### Run all tests with the UI (recommended)

```plaintext
npm run test:ui
```

## Development

### Apply format after write code

```plaintext
npm run format
```

### Run specific test file

```plaintext
npm run test tests/home.spec.ts
```

### Run specific test file with the UI

```plaintext
npm run test:ui tests/home.spec.ts
```

### There is not need to run tests in order

Some tests inside a directory are named with prefixes 1. , 2. , 3. , etc… This means the order of the process logic of the whole functionality for the directory, but test are independent of each other.

### TO DO…

#### There's some more tests to add in the future:

*   Test upload order files with the shipper
*   Test upload order files with the courier