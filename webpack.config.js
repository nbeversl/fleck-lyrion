const path = require("path");

module.exports = {
    node : {
        fs: 'empty'
    },
    entry: "./src/index.jsx",
    output: {
        filename: "main.js",
        // path : "/Volumes/Mac\ Mini SSD/Library/PreferencePanes/Squeezebox.prefPane/Contents/server/HTML/Nate",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module  : {
        rules: [
            { 
                test: /\.(t|j)sx?$/, 
                exclude:  /(node_modules)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        //presets : ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader'},
                ]
            },
            { 
                enforce: "pre", 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "source-map-loader" }

        ]
    },
    devtool: "source-map"
}