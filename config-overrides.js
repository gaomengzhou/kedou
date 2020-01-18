const { addWebpackAlias, override, useEslintRc, addDecoratorsLegacy, fixBabelImports, addLessLoader } = require('customize-cra')
const path = require('path')
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    }),
    addWebpackAlias({
        '@': path.resolve(__dirname, 'src/'),
    }),
    useEslintRc(),
    addDecoratorsLegacy(),
    addLessLoader(),
)
