import React from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { Container } from '@mui/material';
import Header from '../Header'
import { isAuthorized } from '../../api/auth';

const Page = ({children, title}) => {
	if (!isAuthorized()) {
		return <Navigate to="/auth" replace />
	}

	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<Header/>
			<Container maxWidth="xl">
				{children}
			</Container>
		</>
	)
}

export default Page;