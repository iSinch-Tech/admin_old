import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography } from "@mui/material";

const thumbsContainer = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	position: 'absolute',
	top: 0,
	left: 0,
	opacity: '0.9'
};

const thumb = {
	display: 'inline-flex',
	borderRadius: 2,
	marginBottom: 8,
	marginRight: 8,
	width: '100%',
	height: 200,
	boxSizing: 'border-box'
};

const thumbInner = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden'
};

const img = {
	display: 'block',
	width: 'auto',
	height: '100%'
};


const Previews = (props) => {
	const {getRootProps, getInputProps} = useDropzone({
		accept: {
			'image/*': [],
		},
		maxFiles: 1,
		onDropAccepted: acceptedFiles => {
			const reader = new FileReader();
			reader.readAsDataURL(acceptedFiles[0]);
			reader.onload = function () {
				props.attachHandler(acceptedFiles.map(file => Object.assign(file, {
					preview: URL.createObjectURL(file),
					base64: reader.result
				})));
			};
		},
	});

	const thumbs = props.files.map(file => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img
					alt=""
					src={file.preview}
					style={img}
					onLoad={() => { URL.revokeObjectURL(file.preview) }}
				/>
			</div>
		</div>
	));

	useEffect(() => {
		return () => props.files.forEach(file => URL.revokeObjectURL(file.preview));
	}, [props.files]);

	return (
		<section className="container">
			<div {...getRootProps({className: 'dropzone'})}>
				<input {...getInputProps()} />
				{props.files.length === 0 && (
					<Typography
						variant="button"
						gutterBottom
						style={{fontWeight: '700', textAlign: 'center', padding: '9px'}}
					>
						Прикрепите изображение для вопроса в формате 16:9
					</Typography>
				)}
			</div>
			<aside style={thumbsContainer}>
				{thumbs}
			</aside>
		</section>
	);
}

export default Previews;