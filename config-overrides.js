/**
 * @configuration config-overrides.js
 * @description webpack配置覆盖
 * @time 2020/1/6
 * @author Aiden
 */
const {
    addWebpackAlias,
    override,
    useEslintRc,
    addDecoratorsLegacy,
    fixBabelImports,
    addLessLoader
} = require('customize-cra')
const path = require('path')||''
const paths = require('react-scripts/config/paths');
const rewiredMap = () => config => {
    paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist-prod');
    config.output.path = path.join(path.dirname(config.output.path||__dirname), 'dist-prod');
    
    return config
}
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
    rewiredMap()
)
