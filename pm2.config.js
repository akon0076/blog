module.exports = {
  apps: [
    {
      name: 'nest-react-ssr-app',
      args: 'p 9000 -s ./dist',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
