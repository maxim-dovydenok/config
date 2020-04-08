const fs = require('fs');
const { promisify } = require('util');

const existsPromise = promisify(fs.exists);
const readFilePromise = promisify(fs.readFile);

class Options {
  constructor(fileOptions) {
    this.options = fileOptions;
    this.process = process;
  }

  async initialize() {
    const rawOptions = await this.initializeOptions(this.options);

    const invalidOptions = rawOptions.filter((option) => option.error);

    if (invalidOptions.length > 0) {
      const error = new Error('Invalid options found');
      error.options = invalidOptions.map((option) => option.error);

      throw error;
    }

    this.values = rawOptions.reduce((result, option) => ({
      ...result,
      [option.label]: option.value,
    }), {});
  }

  get(option) {
    if (!this.values) {
      throw new Error('Options are not initialized yet');
    }

    return this.values[option] || process.env[option];
  }

  async initializeOptions(options) {
    return Promise.all(options
      .map((option) => ({ label: option, value: null }))
      .map(async (option) => {
        const envName = option.label;
        const fileEnvName = `${envName}_FILE`;
        const fileEnvValue = this.process.env[fileEnvName];

        if (fileEnvValue) {
          const fileExists = await existsPromise(String(fileEnvValue));
          if (!fileExists) {
            return {
              ...option,
              value: null,
              error: {
                envName: fileEnvName,
                message: `File "${String(fileEnvValue)}" not found`,
              },
            };
          }

          try {
            return { ...option, value: String(await readFilePromise(String(fileEnvValue))).trim() };
          } catch (err) {
            return {
              ...option,
              value: null,
              error: {
                envName: fileEnvName,
                message: `No access to read file "${String(fileEnvValue)}"`,
              },
            };
          }
        }

        const envValue = this.process.env[envName];
        if (!envValue) {
          return {
            ...option,
            value: null,
            error: {
              envName,
              message: 'Variable is empty or missing',
            },
          };
        }

        return { ...option, value: envValue };
      }));
  }

  setProcess(process) {
    this.process = process;
  }
}

module.exports = Options;
