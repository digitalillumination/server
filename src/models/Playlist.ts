import mongoose from 'mongoose';
import { UserDocument } from './User';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface IPlaylist {
    name: string,
    by: mongoose.Types.ObjectId | UserDocument,
    createdAt: Date
};

export interface PlaylistDocument extends mongoose.Document, IPlaylist {};

const Playlist = mongoose.model<PlaylistDocument>("Playlist", playlistSchema);

export default Playlist;