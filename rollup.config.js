import babel from '@rollup/plugin-babel';
import browsersync from 'rollup-plugin-browsersync';
import clear from 'rollup-plugin-clear';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';

const entrypoint = 'app';
const outputDir = 'docs';

// Optimise for production delivery
const {
  NODE_ENV: environment = 'production',
  ROLLUP_WATCH: watch = false,
} = process.env;
const jsMin = environment === 'development' ? '' : '.min';
const jsFile = `patchat${jsMin}.js`;

const globals = {
  // vue: 'Vue',
};

export default {
  input: `src/${entrypoint}.js`,
  // external: ['vue', 'vuex', 'google'],
  output: [
    {
      file: `${outputDir}/${jsFile}`,
      format: 'iife',
      name: 'patchat',
      globals,
    },
  ],
  plugins: [
    clear({
      targets: [outputDir],
    }),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': `"${environment}"`,
    }),
    vue({
      css: false,
    }),
    babel({
      configFile: false,
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          { modules: false, useBuiltIns: 'usage', corejs: '3' },
        ],
      ],
    }),
    terser({
      include: [/^.+\.min\.js$/, '*esm*'],
    }),
    scss({
      output: `${outputDir}/patchat.css`,
      includePaths: ['./src/scss'],
      watch: ['src/scss'],
    }),
    copy({
      targets: [
        {
          src: 'src/index.html',
          dest: outputDir,
          transform: (x) =>
            x
              .toString()
              .replace(/__SCRIPT__/g, jsFile)
              .replace(/__MIN__/g, jsMin),
        },
        {
          src: 'src/style.css',
          dest: outputDir,
        },
      ],
      hook: 'buildStart',
    }),
    watch &&
      browsersync({
        server: 'docs',
        reloadDebounce: 1000,
      }),
  ],
};
