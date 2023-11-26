import { NextApiRequest, NextApiResponse } from 'next'
import { serializeError } from 'serialize-error';
import models from '../../../lib/index'
import dbConnect from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { codeString, admin } = JSON.parse(req.body)
	const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
	const runRepl = new AsyncFunction('models', 'admin', 'dbConnect', codeString)
	let resultString
	try {
		const result = await runRepl(models, admin, dbConnect)
		resultString = result ? result.toString() : 'Nothing returned from runRepl()'
		return res.status(200).json({ resultString })
	} catch(err) {
		return res.status(500).json({ resultString: serializeError(err as Error) })
	}
}