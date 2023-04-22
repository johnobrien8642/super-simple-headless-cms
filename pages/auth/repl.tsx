import { useState } from 'react'
import dbConnect from '../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { GetServerSideProps } from 'next'
import Admin from '../../models/Admin'
import Link from 'next/link'
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
	useTheme,
	Code,
	Flex
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
type ReplWindowPropType = {
	data: boolean;
}
const ReplWindow = ({ data }: ReplWindowPropType) => {
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

	// if (process.env.NEXT_PUBLIC_SUPER_ACTIVE === 'false' || data) {
		return (
			<Center>
				<Grid
					gridTemplateColumns={'1.5fr 1fr'}
					gap={'5%'}
					width={'90%'}
					mt={'5%'}
				>
					<Box>
						<Link href={'/admin'}><Text as='h3' textDecoration={'underline'}>Admin Page</Text></Link>
						<Link href={'/create_post'}><Text as='h3' textDecoration={'underline'} mb={10}>Create Post</Text></Link>
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
									<Text as='h3' mt={50}>Personal Site Repl</Text>
									<Text>-"models", "admin", and "dbConnect" available in repl function scope</Text>
									<Text>-"models" is the Mongoose models index object, "admin" is the current signed in admin object</Text>
									<Text>-"dbConnect" is the mongoose connection function, run at top of file like "await dbConnect()"</Text>
									<Text>-Hit submit, code will be sent and run in API, results will be returned</Text>
									<Text>Examples</Text>
									<Text>- See available models</Text>
									<Code children="return Object.keys(models)" />
									<Text marginTop={5}>- Query all docs</Text>
									<Flex
										flexDirection={'column'}
										width='fit-content'
									>
										<Code children="await dbConnect()" />
										<Code children="const { Admin } = models" />
										<Code children="return await Admin.find({})" />
									</Flex>
									<Text marginTop={5}>- Query all docs and iterate and return an array of ids</Text>
									<Flex
										flexDirection={'column'}
										width='fit-content'
										marginBottom={5}
									>
										<Code children="await dbConnect()" />
										<Code children="const { Admin } = models" />
										<Code children="const admins = await Admin.find({})" />
										<Code children="return adminIds = admins.map(obj => obj._id)" />
									</Flex>
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
	// }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	await dbConnect();
	type jwtType = {
		id: string;
	} & jwt.JwtPayload
	let decoded;
	let authenticated
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY!) as jwtType;
		if (decoded) {
			authenticated = await Admin.findById(decoded.id);
		}
	}

	return {
		props: {
			data: !!authenticated
		}
	};
}

export default ReplWindow