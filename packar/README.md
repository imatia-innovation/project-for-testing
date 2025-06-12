## First steps to config project before init:

### 1\. Get in the directory and install dependencies:

```plaintext
cd packar/
npm install
```

### 2\. Environment Vars

example.env File shows the names (without values) of the environment variables that must be used to run the tests in the .env file

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