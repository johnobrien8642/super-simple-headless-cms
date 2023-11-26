import React, { useEFfect, useState, useRef } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { MdFullscreen } from "react-icons/md";
import { useRouter } from 'next/router';

const VideoPlayer = ({ template }) => {
	const [touchStartX, setTouchStartX] = useState(0)
	const searchParams = useSearchParams();
	const router = useRouter();
	const vidContRef = useRef();

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
						vidContRef.current.requestFullscreen();
					}
				}}
				onTouchStart={e => setTouchStartX(e.changedTouches[0].screenX)}
				onTouchEnd={e => {
					if (e.changedTouches[0].screenX > touchStartX) router.back();
				}}
			>
				<video muted autoPlay loop style={{ right: '0', bottom: '0', width: '100%', height: '100%' }}>
					<source src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + searchParams.get('_id')} />
				</video>
			</Box>
		</Box>
	)
}

export default VideoPlayer;