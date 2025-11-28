const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwindcss = require('@tailwindcss/postcss');
const { heroui } = require("@heroui/theme");
const colors = require('tailwindcss/colors');

module.exports = {
    rollup(config, options) {
        config.plugins.push(
            postcss({
                plugins: [
                    tailwindcss({
                        purge: ['./src/**/*.tsx'],
                        theme: {
                            extend: {},
                        },
                        variants: {
                            extend: {},
                        },
                        darkMode: true,
                        plugins: [
                            heroui(),
                        ]
                    }),
                    autoprefixer(),
                ],
                inject: true,
                // only write out CSS for the first bundle (avoids pointless extra files):
                extract: !!options.writeMeta,
            })
        );
        return config;
    },
};