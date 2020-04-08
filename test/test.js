const Options = require('../index');

test('reads env option', async () => {
  const options = new Options(['TEST']);
  options.setProcess({
    env: {
      TEST: 'VALUE_FROM_ENV',
    },
  });

  await options.initialize();

  expect(options.get('TEST')).toBe('VALUE_FROM_ENV');
});

test('reads file option - without env', async () => {
  const options = new Options(['TEST']);
  options.setProcess({
    env: {
      TEST_FILE: 'test/test.txt',
    },
  });

  await options.initialize();

  expect(options.get('TEST')).toBe('VALUE_FROM_FILE');
});

test('reads file option - with env', async () => {
  const options = new Options(['TEST']);
  options.setProcess({
    env: {
      TEST: 'VALUE_FROM_ENV',
      TEST_FILE: 'test/test.txt',
    },
  });

  await options.initialize();

  expect(options.get('TEST')).toBe('VALUE_FROM_FILE');
});

