import { useState } from 'react';
import dbConnect from '../../lib/mongodb';
import jwt from 'jsonwebtoken'
import { GetServerSideProps, NextPage } from 'next';
import Admin from '../../models/Admin';
import Link from 'next/link';
import {
	Center,
	Box,
	Text,
	Grid,
	Button,
	useTheme,
	Code,
	Heading
} from '@chakra-ui/react';
import {
	Formik
} from 'formik';
import dynamic from 'next/dynamic';
import beautify from 'json-beautify';
import Head from 'next/head';
const AceEditor = dynamic(
	() => import('../../util/components/util/ace_editor'),
	{ ssr: false }
)
type CodeEditorType = {
	codeString: string;
}
type AdminLoginType = {
	username: string;
	password: string;
}
type ReplWindowPropType = {
	loggedIn: boolean;
}
const ReplWindow: NextPage<ReplWindowPropType> = ({}) => {
	let [result, setResult] = useState('');
	let [error, setError] = useState('');
	let [codeString, setCodeString] = useState('');
	const theme = useTheme()
	const codeEditorInitVals:
		CodeEditorType = {
			codeString: ''
		}
	const adminSigninInitVals:
		AdminLoginType = {
			username: '',
			password: ''
		}
	return (
		<>
			<Head>
				<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
			</Head>
			<Heading fontSize='1.5rem' m='3rem' textDecoration={'underline'}><Link href={'/admin/manage-pages'}>Back to Manage Pages</Link></Heading>
			<Center>
				<Grid
					gridTemplateColumns={'1.5fr 1fr'}
					gap={'5%'}
					width={'90%'}
					my='3rem'
				>
					<Box>
						<Formik
							initialValues={codeEditorInitVals}
							onSubmit={async (values, actions) => {
								const res = await fetch('/api/auth/repl', {
									method: 'POST',
									body: JSON.stringify({ codeString }),
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json'
									}
								})
								if (res.ok) {
									const { finalResult } = await res.json()
									setResult(finalResult)
								} else {
									const { error } = await res.json()
									setError(error)
								}
							}}
						>
							{props => (
								<form
									onSubmit={props.handleSubmit}
								>
									<AceEditor
										style={{ width: '100%'}}
										mode='javascript'
										setCodeString={setCodeString}
										name='codeString'
										editorProps={{ $blockScrolling: true }}
										enableBasicAutocompletion
										fontSize={'1rem'}
									/>
									<Button type='submit' mt={'5%'}>Submit</Button>
									{error && <Text fontSize='1.1rem' color='red' my='1rem'>{`Server Error: ${error}`}</Text>}
									<Text fontSize='1.2rem' my='1rem'>All mongoose models available in "models". Use Mongoose/Javascript as you normally would.</Text>
									<Text fontSize='1.5rem' my='1rem'>Examples</Text>
									<Text fontSize='1.1rem' textDecoration='underline' my='.5rem'>See all available models</Text>
									<Code fontSize='1.2rem' my='1.2rem' padding='.5rem' children="return Object.keys(models);" />
									<Text my='.5rem' fontSize='1.1rem' textDecoration='underline'>Query all docs</Text>
									<Code
										flexDirection={'column'}
										width='fit-content'
										padding='.5rem'
										display='flex'
										flexDir='column'
									>
										<Code fontSize='1.2rem' children="const { Admin } = models;" />
										<Code fontSize='1.2rem' children="return await Admin.find({});" />
									</Code>
									<Text my='1.2rem' fontSize='1.1rem' textDecoration='underline'>Query all docs and iterate and return an array of ids</Text>
									<Code
										flexDirection={'column'}
										width='fit-content'
										padding='.5rem'
										display='flex'
										flexDir='column'
										mt='1.2rem'
										mb='5rem'
									>
										<Code fontSize='1.2rem' children="const { Admin } = models;" />
										<Code fontSize='1.2rem' children="const admins = await Admin.find({});" />
										<Code fontSize='1.2rem' children="return adminIds = admins.map(obj => obj._id);" />
									</Code>
								</form>
							)}
						</Formik>
					</Box>
					<Box>
						<Text fontSize='1.5rem'>Results</Text>
						<Box
							width='800px'
							height='800px'
							outline='.1px solid black'
							borderRadius='1%'
							color='black'
							overflowY={'auto'}
							padding={'2%'}
							overscrollBehavior='none'
						>
							<pre className='prettyprint'>
								<code className='language-javascirpt'>
									{
										//@ts-expect-error
										result ? beautify(result, null, 2, 100) : ''
									}
								</code>
							</pre>
						</Box>
						<Button mt={'2%'} onClick={() => setResult('')}>Clear</Button>
					</Box>
				</ Grid>
			</Center>
		</>
	)
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	await dbConnect();
	type jwtType = {
		id: string;
	} & jwt.JwtPayload
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY!) as jwtType;
	}
	const authenticated = await Admin.findById(decoded?.id);
	if (authenticated) {
		return {
			props: {
				admin: !!authenticated
			}
		};
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
			props: {
				admin: !!authenticated
			}
		};
	}
}

export default ReplWindow