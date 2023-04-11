import { NextApiRequest, NextApiResponse } from 'next'
import models from '../../../lib/index'
import dbConnect from '../../../lib/mongodb'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { codeString, admin } = JSON.parse(req.body)
	const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
	const runRepl = new AsyncFunction('models', 'admin', 'dbConnect', codeString)
	const result = await runRepl(models, admin, dbConnect)
	const resultString = result ? result.toString() : 'Nothing returned from runRepl()'
	return res.status(200).json({ resultString })
}