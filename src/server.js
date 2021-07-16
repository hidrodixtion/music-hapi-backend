const Hapi = require('@hapi/hapi');
require('dotenv').config()
// const routes = require('./routes');
const notes = require('./api/notes')
const NoteService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes')

const init = async () => {
  const noteService = new NoteService()
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
      service: noteService,
      validator: NotesValidator,
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
