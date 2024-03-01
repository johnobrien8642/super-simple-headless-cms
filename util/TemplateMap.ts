import React from "react";
import { TemplatesEnum } from "../models/model-types";
import PhotoList from "./components/templates/PhotoList";
import VideoPlayer from "./components/templates/VideoPlayer";
import HeadlineOnlyCTA from "./components/templates/HeadlineOnlyCTA";
import TextBlock from "./components/templates/TextBlock";
import PDFView from "./components/templates/PDFView";

const TemplateMap: { [key in TemplatesEnum]: any } = {
	'PhotoList': PhotoList,
	'VideoPlayer': VideoPlayer,
	'TextBlock': TextBlock,
	'HeadlineOnlyCTA': HeadlineOnlyCTA,
	'PDFView': PDFView
}

export default TemplateMap;