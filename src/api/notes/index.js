const NoteHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'notes',
    version: '1.0.0',
    register: async (server, {service}) => {
        const notesHandler = new NoteHandler(service)
        server.route(routes(notesHandler))
    }
}