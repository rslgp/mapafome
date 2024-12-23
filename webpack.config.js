const webpack = require('webpack')
const dotenv = require('dotenv')

// this will update the process.env with environment variables in .env file
dotenv.config();

module.exports = {
  //...
  plugins: [
    // ...
    new webpack.DefinePlugin({
       'process.env': JSON.stringify(process.env)
    })
    // ...
  ]
  //...
}
