import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './temp/index.js', // TSC Compiled Output
  mode: 'production',
  target: 'node22',
  experiments: {
    outputModule: true, // Bundle will be ESM
  },
  optimization: {
    minimize: true,
    minimizer: [
      // Remove bundle comments and license files.
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: 'scriptorium.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module', // Consumers will be informed to use ESM.
    },
  },
};
