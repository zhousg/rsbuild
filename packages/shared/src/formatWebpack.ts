/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/facebook/create-react-app/blob/master/LICENSE
 */

// Modified by Chao Xu (xuchaobei)

import type webpack from 'webpack';
import type { StatsCompilation } from 'webpack';

const friendlySyntaxErrorLabel = 'SyntaxError:';

function isLikelyASyntaxError(message: string) {
  return message.includes(friendlySyntaxErrorLabel);
}

// Cleans up webpack error messages.
function formatMessage(stats: webpack.StatsError | string) {
  let lines: string[] = [];

  let message: string;

  // webpack 5 stats error object
  if (typeof stats === 'object') {
    const fileName = stats.moduleName ? `File: ${stats.moduleName}\n` : '';
    // compat rspack
    const mainMessage =
      typeof stats.formatted === 'string' ? stats.formatted : stats.message;

    const details = stats.details ? `\nDetails: ${stats.details}\n` : '';
    const stack = stats.stack ? `\n${stats.stack}` : '';

    message = `${fileName}${mainMessage}${details}${stack}`;
  } else {
    message = stats;
  }

  lines = message.split('\n');

  // Transform parsing error into syntax error
  lines = lines.map((line) => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
      line,
    );
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });

  message = lines.join('\n');

  // Smoosh syntax errors (commonly found in CSS)
  message = message.replace(
    /SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
    `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`,
  );

  lines = message.split('\n');

  // Remove leading newline
  if (lines.length > 2 && lines[1].trim() === '') {
    lines.splice(1, 1);
  }
  // Clean up file name
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1] && lines[1].indexOf('Module not found:') !== -1) {
    lines[1] = lines[1].replace('Error: ', '');
  }

  // Remove duplicated newlines
  lines = lines.filter(
    (line, index, arr) =>
      index === 0 ||
      line.trim() !== '' ||
      line.trim() !== arr[index - 1].trim(),
  );

  // Reassemble the message
  message = lines.join('\n');
  return message.trim();
}

type ErrorHelper = {
  validator: (message: string) => boolean | void;
  formatter: (message: string) => string;
};

const noop = (message: string) => message;
const defaultColor = {
  gray: noop,
  cyan: noop,
  green: noop,
  yellow: noop,
  underline: noop,
};

export function addErrorTips(errors: string[], color = defaultColor) {
  const errorHelpers: ErrorHelper[] = [
    {
      validator(message) {
        return (
          (message.includes('You may need an appropriate loader') ||
            message.includes('You may need an additional loader')) &&
          message.includes('.ts')
        );
      },
      formatter(message) {
        return `${message}\n\n${color.yellow(
          `If it is a TypeScript file, you can use "source.include" config to compile it. see ${color.underline(
            'https://modernjs.dev/builder/en/api/config-source.html#sourceinclude',
          )}`,
        )}

${color.green(`${color.gray('// config file')}
export default {
  source: {
    include: [
      ${color.gray('// add some include rules')}
    ]
  }
}`)}
        `;
      },
    },
  ];

  return errors.map((error) => {
    const helper = errorHelpers.find((item) => item.validator(error));
    return helper ? helper.formatter(error) : error;
  });
}

function formatWebpackMessages(
  json?: Pick<StatsCompilation, 'errors' | 'warnings'>,
  color = defaultColor,
): {
  errors: string[];
  warnings: string[];
} {
  const formattedErrors = json?.errors?.map(formatMessage);
  const formattedWarnings = json?.warnings?.map(formatMessage);

  const result = {
    errors: formattedErrors || [],
    warnings: formattedWarnings || [],
    errorTips: [],
  };

  if (result.errors?.some(isLikelyASyntaxError)) {
    // If there are any syntax errors, show just them.
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }

  // First error is usually it.
  if (result.errors.length > 1) {
    result.errors.length = 1;
  }

  result.errors = addErrorTips(result.errors, color);

  return result;
}

export { formatWebpackMessages };
