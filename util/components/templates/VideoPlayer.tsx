import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { MdFullscreen } from "react-icons/md";
import { useRouter } from 'next/router';
import { BasePropsType } from '../types/prop_types';

const VideoPlayer = ({ template }: BasePropsType) => {
	const [touchStartX, setTouchStartX] = useState(0)
	const searchParams = useSearchParams();
	const router = useRouter();
	const vidContRef = useRef<HTMLDivElement>(null);

	return (
		<Box
			key={template._id}
			width='100vw'
			height='100vh'
			sx={{
				position: 'fixed',
				right: '0',
				bottom: '0'
			}}

		>
			<Box
				display='flex'
				position='relative'
				width='100%'
				height='100%'
				ref={vidContRef}
				onDoubleClick={() => {
					if (document?.fullscreenElement !== null) {
						document.exitFullscreen();
					} else {
						vidContRef.current?.requestFullscreen();
					}
				}}
				onTouchStart={e => setTouchStartX(e.changedTouches[0].screenX)}
				onTouchEnd={e => {
					if (e.changedTouches[0].screenX > touchStartX) router.back();
				}}
			>
				<video muted autoPlay loop style={{ right: '0', bottom: '0', width: '100%', height: '100%' }}>
					<source src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + searchParams.get('_id')} />
				</video>
			</Box>
		</Box>
	)
}

export default VideoPlayer;