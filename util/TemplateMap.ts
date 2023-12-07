import { TemplatesEnum } from "../models/model-types";
import ImageGrid from "./components/templates/ImageGrid";
import ImageTriptych from "./components/templates/ImageTriptych";
import PhotoList from "./components/templates/PhotoList";
import VideoPlayer from "./components/templates/VideoPlayer";
import BookCoverCTA from "./components/templates/BookCoverCTA";
import HeadlineOnlyCTA from "./components/templates/HeadlineOnlyCTA";
import TextBlock from "./components/templates/TextBlock";
import About from "./components/templates/About";
import PdfList from './components/templates/PdfList';

const TemplateMap: { [key in TemplatesEnum]: any } = {
	'ImageGrid': ImageGrid,
	'ImageTriptych': ImageTriptych,
	'PhotoList': PhotoList,
	'VideoPlayer': VideoPlayer,
	'BookCoverCTA': BookCoverCTA,
	'TextBlock': TextBlock,
	'HeadlineOnlyCTA': HeadlineOnlyCTA,
	'About': About,
	'PdfList': PdfList
}

export default TemplateMap;