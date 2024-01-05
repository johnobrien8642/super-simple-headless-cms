import { useState, useRef, useEffect } from 'react';
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
	Heading,
	Spinner,
	Flex,
	Select
} from '@chakra-ui/react';
import {
	Formik
} from 'formik';
import beautify from 'json-beautify';
import Head from 'next/head';
import Editor from '@monaco-editor/react';
import { kebabCase } from 'lodash';
type CodeEditorType = {
	codeString: string;
}
type AdminLoginType = {
	username: string;
	password: string;
}
type ReplWindowPropType = {
	loggedIn: boolean;
	editorTheme: string;
	adminId: string;
}
const ReplWindow: NextPage<ReplWindowPropType> = ({ editorTheme, adminId }) => {
	let [result, setResult] = useState('');
	let [error, setError] = useState('');
	let [loading, setLoading] = useState(false);
	let [themeStr, setThemeStr] = useState(editorTheme);
	const themeStrArr = [
		'Active4D',
		'Monokai',
		'Monokai Bright',
		'Birds of Paradise',
		'Clouds Midnight',
		'GitHub Dark',
		'GitHub Light',
		'GitHub',
		'monoindustrial',
		'Textmate (Mac Classic)'
	];
	const editorRef = useRef(null);
	const monacoRef = useRef(null);
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

	function handleEditorDidMount(editor: any, monaco: any) {
		import(`monaco-themes/themes/${themeStr}.json`)
			.then(data =>{
				const theme = kebabCase(themeStr.split('.')[0].toLowerCase());
				monaco.editor.defineTheme(theme, {...data, base: 'hc-black'})
				monaco.editor.setTheme(theme)
			})
		editorRef.current = editor;
		monacoRef.current = monaco;
	}

	useEffect(() => {
		handleSetTheme()
		async function handleSetTheme() {
			if (monacoRef.current) {
				import(`monaco-themes/themes/${themeStr}.json`)
					.then(data =>{
						const theme = kebabCase(themeStr.split('.')[0].toLowerCase());
						//@ts-expect-error
						monacoRef.current?.editor?.defineTheme(theme, data)
						//@ts-expect-error
						monacoRef.current?.editor?.setTheme(theme)
					})
			}
		}
	}, [themeStr])

	return (
		<>
			<Head>
				<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
			</Head>
			<Heading fontSize='1.5rem' m='3rem' textDecoration={'underline'}><Link href={'/admin/manage-pages'}>Back to Manage Pages</Link></Heading>
			<Center
				maxW='1200px'
				m='0 auto'
			>
				<Grid
					gridTemplateColumns={'1.15fr 1fr'}
					gap={'5%'}
					my='3rem'
				>
					<Box>
						<Formik
							initialValues={codeEditorInitVals}
							onSubmit={async (values, actions) => {
								setLoading(true);
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
									setLoading(false);
									setResult(finalResult)
								} else {
									const { error } = await res.json()
									setLoading(false);
									setError(error)
								}
							}}
						>
							{props => (
								<form
									onSubmit={props.handleSubmit}
								>
									<Select
										onChange={async (e) => {
											setThemeStr(e.target.value)
											const res = await fetch('/api/handle_update_admin_theme', {
												method: 'PUT',
												headers: {
													Accept: 'application/json',
													'Content-Type': 'application/json'
												},
												body: JSON.stringify({
													editorTheme: e.target.value,
													adminId
												})
											});
											if (!res.ok) {
												const { errorMessage } = await res.json();
												console.log(`Update admin theme failed: ${errorMessage}`);
											}
										}}
										placeholder='Choose Theme'
										value={themeStr}
										width='30%'
										position='relative'
										top='-1rem'
										fontSize='.8rem'
										height='1.5rem'
									>
										{
											themeStrArr.map(str => {
												return <option key={str} value={str}>{str}</option>
											})
										}
									</Select>
									<Box
										height='600px'
										outline='.1px solid gray'
										padding='.5rem'
										borderRadius='1%'
									>
										<Editor
											height='100%'
											defaultLanguage='javascript'
											defaultValue='// Monaco editor (powers VS Code)'
											onMount={handleEditorDidMount}
											onChange={() => {
												//@ts-expect-error
												setCodeString(editorRef?.current?.getValue())
											}}
										/>
									</Box>
									<Flex
										alignContent='center'
										my='2rem'
									>
										<Button isDisabled={loading} type='submit'>Submit</Button>
										{loading && <Spinner my='auto' ml='1rem' />}
									</Flex>
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
							height='800px'
							outline='.1px solid black'
							borderRadius='1%'
							color='black'
							overflowY={'auto'}
							padding={'2%'}
							overscrollBehavior='none'
							sx={{
								'pre': {
									border: 'none !important'
								}
							}}
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
	let token = context.req.cookies[process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string];
	if (token) {
		decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY!) as jwtType;
	}
	const authenticated = await Admin.findById(decoded?.id);
	if (authenticated) {
		return {
			props: {
				admin: !!authenticated,
				editorTheme: authenticated.editorTheme,
				adminId: authenticated._id.toString()
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