import { NextApiRequest, NextApiResponse } from 'next'
import models from '../../../lib/index'
import dbConnect from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { codeString } = req.body;
	try {
		class AsyncCall {
			#codeString: string;
			private constructor(codeString: string) {
				this.#codeString = codeString;
			}
			static async runRepl(codeString: string) {
				await dbConnect();
				const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
				const runReplInner = new AsyncFunction('models', codeString);
				const result = await runReplInner(models);
				return result ? result : 'Nothing returned'
			}
		}
		const finalResult = await AsyncCall.runRepl(codeString);
		return res.status(200).json({ finalResult })
	} catch(err: any) {
		return res.status(500).json({ error: err.message })
	}
}