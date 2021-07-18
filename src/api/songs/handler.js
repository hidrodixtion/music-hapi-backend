const ClientError = require("../../exceptions/ClientError");

class SongHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    errorHandler(error, h) {
        if (error instanceof ClientError) {
            const response = h.response({
                status: 'fail',
                message: error.message
            })
            // console.log(response)
            response.code(error.statusCode)
            return response
        }

        // Server ERROR!
        const response = h.response({
            status: 'fail',
            message: 'Maaf, terjadi kegagalan pada server kami.'
        })
        response.code(500)
        return response
    }
    
    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const { title = 'untitled', year, performer, genre, duration } = request.payload;
            const songId = await this._service.addSong({title, year, performer, genre, duration})
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId
                }
            })
            response.code(201)
            return response
        } catch ( error) {
            return this.errorHandler(error, h)
        }
    }
    
    async getSongsHandler(request, h) {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }
    
    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            return this.errorHandler(error, h)
        }
    }
    
    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const { id } = request.params;
            
            await this._service.editSongById(id, request.payload);
            
            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            return this.errorHandler(error, h)
        }
    }
    
    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSongById(id);
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            return this.errorHandler(error, h)
        }
    }
}

module.exports = SongHandler