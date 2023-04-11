import { useState } from 'react'
import {
	Center,
	Box,
	Text,
	Grid,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	useTheme
} from '@chakra-ui/react'
import {
	Formik,
	Form
} from 'formik'
// import 'ace-builds/src-noconflict/ace'
// import 'ace-builds/src-noconflict/mode-javascript'
import dynamic from 'next/dynamic'
// import AceEditor from 'react-ace'
import { AdminType } from '../../models/Admin'
const AceEditor = dynamic(
	() => import('../../util/ace_editor'),
	{ ssr: false }
)

type CodeEditorType = {
	codeString: string;
}
type AdminLoginType = {
	username: string;
	password: string;
}
const ReplWindow = () => {
	let [admin, setAdmin] = useState<AdminType | null>(null)
	let [result, setResult] = useState('')
	let [codeString, setCodeString] = useState('')
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

	if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'false' || admin) {
		return (
			<Center>
				<Grid
					gridTemplateColumns={'1.5fr 1fr'}
					gap={'5%'}
					width={'90%'}
					mt={'5%'}
				>
					<Box>
						<Formik
							initialValues={codeEditorInitVals}
							onSubmit={async (values, actions) => {
								const res = await fetch('/api/auth/repl', {
									method: 'POST',
									body: JSON.stringify({ codeString, admin })
								})
								const data = await res.json()
								setResult(data.resultString)
							}}
						>
							{props => (
								<form
									onSubmit={props.handleSubmit}
								>
									<Text as='h3'>Clik Dating Repl</Text>
									<Text>-"models", "admin", and "dbConnect" available in repl function scope</Text>
									<Text>-"models" is the Mongoose models index object, "admin" is the current signed in admin object</Text>
									<Text>-"dbConnect" is the mongoose connection function, run at top of file like "await dbConnect()"</Text>
									<Text>-Hit submit, code will be sent and run in API, results will be returned</Text>
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
								</form>
							)}
						</Formik>
					</Box>
					<Box>
						<Text as='h3'>Results</Text>
						<Box
							width={'100%'}
							height={'100%'}
							backgroundColor={'var(--chakra-colors-blackAlpha-200)'}
							overflowY={'auto'}
							padding={'2%'}
						>{result}</Box>
						<Button mt={'2%'} onClick={() => setResult('')}>Clear</Button>
					</Box>
				</ Grid>
			</Center>
		)
	} else {
		return (
			<Center>
				<Box mt={'10%'} >
					<Formik
						initialValues={adminSigninInitVals}
						onSubmit={async (values, actions) => {
							const res = await fetch('/api/auth/login_admin', {
								method: 'POST',
								body: JSON.stringify(values)
							})
							const data = await res.json()
							console.log(data)
							if (!data.error) {
								setAdmin(data)
							} else {
								actions.setFieldError('username', data.error)
							}
						}}
					>
						{props => (
							<Form
								onSubmit={props.handleSubmit}
							>
								<FormControl>
									<FormLabel htmlFor='username'>Username</FormLabel>
									<Input
										id='username'
										name='username'
										type='text'
										onChange={props.handleChange}
										value={props.values.username}
									/>
								</FormControl>
								<FormControl>
									<FormLabel htmlFor='password'>Password</FormLabel>
									<Input
										id='password'
										name='password'
										type='text'
										onChange={props.handleChange}
										value={props.values.password}
									/>
								</FormControl>
								<FormErrorMessage>{props.errors.username}</FormErrorMessage>
								<Button mt={'10%'} type='submit'>Submit</Button>
							</Form>
						)}
					</Formik>
				</Box>
			</Center>
		);
	}
};

export default ReplWindow