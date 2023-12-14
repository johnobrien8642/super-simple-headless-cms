import Section from '../models/Section';
import Piece from '../models/Piece';
import Post from '../models/Post';
import Sub from '../models/Sub';
import Essay from '../models/Essay';
import Admin from '../models/Admin';
import Page from '../models/Page';
import PageManager from '../models/PageManager';
import Templates from '../models/Templates';
import Assets from '../models/Assets';
import mongoose from 'mongoose';

const models: { [key: string]: typeof mongoose.Model } = {
	Section,
	Piece,
	Post,
	Sub,
	Essay,
	Admin,
	Page,
	PageManager,
	Templates,
	Assets
};

export default models;
