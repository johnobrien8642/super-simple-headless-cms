
import React, { ReactElement } from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

class CustomDocument extends Document {
	render(): ReactElement {
		return (
			<Html>
				<body>
					<Main />
					<NextScript />
				</body>
				<Analytics />
				<SpeedInsights />
			</Html>
		);
	}
}

export default CustomDocument;