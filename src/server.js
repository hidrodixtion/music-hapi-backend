const Hapi = require('@hapi/hapi');
require('dotenv').config()
// const routes = require('./routes');
const notes = require('./api/songs')
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs')

const init = async () => {
  const songsService = new SongsService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route(routes);

  await server.register({
    plugin: notes,
    options: {
      service: songsService,
      validator: SongsValidator,
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
