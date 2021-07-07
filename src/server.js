const Hapi = require('@hapi/hapi');
// const routes = require('./routes');
const notes = require('./api/notes')
const NoteService = require('./services/inMemory/noteService');

const init = async () => {
  const noteService = new NoteService()
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
      service: noteService
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
