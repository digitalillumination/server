import mongoose from 'mongoose';
import User, {UserDocument} from "./User";
import Image from "./Image";

const albumSchema = new mongoose.Schema({
    by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: User.modelName
    },
    title: {
        type: String,
        required: [true, "앨범 제목을 입력해주세요."]
    },
    songTitles: {
        type: [String],
        required: true
    },
    songs: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        enum: ["single", "album"],
        required: true
    },
    image: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Image.modelName
    }
});

export interface IAlbum {
    by: mongoose.Types.ObjectId | UserDocument,
    title: string,
    songTitles: string[],
    songs: string[],
    type: "single" | "album"
    image?: mongoose.Types.ObjectId
}

export interface AlbumDocument extends mongoose.Document, IAlbum {}

const Album = mongoose.model<AlbumDocument>("Album", albumSchema);

export default Album;