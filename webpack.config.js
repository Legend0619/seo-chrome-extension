const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.tsx",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
                { from: "src/background.js", to: "../background.js" },
                { from: "src/content.js", to: "../content.js" },
                { from: "src/assets/logo.jpg", to: "../assets/logo.jpg" },
                { from: "src/assets/qn_16.png", to: "../assets/qn_16.png" },
                { from: "src/assets/qn_32.png", to: "../assets/qn_32.png" },
                { from: "src/assets/qn_48.png", to: "../assets/qn_48.png" },
                { from: "src/assets/qn_64.png", to: "../assets/qn_64.png" },
                { from: "src/assets/qn_128.png", to: "../assets/qn_128.png" },
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}
