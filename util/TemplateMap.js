import ImageGrid from "./components/templates/ImageGrid";
import ImageTriptych from "./components/templates/ImageTriptych";
import PhotoList from "./components/templates/PhotoList";
import VideoPlayer from "./components/templates/VideoPlayer";
import BookCoverCTA from "./components/templates/BookCoverCTA";
import HeadlineOnlyCTA from "./components/templates/HeadlineOnlyCTA";
import TextBlock from "./components/templates/TextBlock";
import About from "./components/templates/About";
import PDFList from './components/templates/PDFList';

const TemplateMap = {
	'Image Grid': ImageGrid,
	'Image Triptych': ImageTriptych,
	'Photo List': PhotoList,
	'Video Player': VideoPlayer,
	'Book Cover CTA': BookCoverCTA,
	'Text Block': TextBlock,
	'Headline Only CTA': HeadlineOnlyCTA,
	'About': About,
	'PDF List': PDFList
}

export default TemplateMap;