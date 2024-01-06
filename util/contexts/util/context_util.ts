export async function init(models: string[]) {
	const ManagePageFormDataTypeObj: { [key: string]: any } = {} as const;
	const initialValueObj: { [key: string]: any } = {};
	const editItemTraceObjType: { [key: string]: any } = {};
	const editItemTraceObjInitObj: { [key: string]: any } = {};
	let AllModelNamesTypeStr: string = '' as const;
	for (let i = 0; i < models.length; i++) {
		ManagePageFormDataTypeObj[models[i]] = {};
		initialValueObj[models[i]] = {};
		if (models.length > 1 && i < models.length - 1) {
			AllModelNamesTypeStr = AllModelNamesTypeStr.concat(`${models[i]} | `)
		} else {
			AllModelNamesTypeStr = AllModelNamesTypeStr.concat(`${models[i]}`)
		}
		editItemTraceObjType[models[i]] = 'string'
		editItemTraceObjInitObj[models[i]] = ''
	}
	let fieldArray;
	let path;
	let obj: { [key: string]: any };
	for (let i = 0; i < models.length; i++) {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get_model_schema?formTitle=${models[i]}`)
			const data = await res.json();
			const { schemaPaths } = data;
			fieldArray = Object.entries(schemaPaths)
			for (let i2 = 0; i2 < fieldArray.length; i2++) {
				path = fieldArray[i2][0];
				obj = fieldArray[i2][1] as { [key: string]: any };
				if (
					!obj.options?.internal &&
					path !== '_id' &&
					path !== '__v'
				) {
					ManagePageFormDataTypeObj[models[i]][path] = resolveObj(obj, 'type');
					initialValueObj[models[i]][path] = resolveObj(obj, 'initVal')
				}

			}
			function resolveObj(obj: { [key: string]: any }, type: string) {
				const instance = obj.instance;
				if (instance === 'String') {
					if (obj.enumValues?.length) {
						return type === 'type' ? `[${obj.enumValues.map((val: any) => `"${val}"`)}] | ''` : '';
					} else {
						return type === 'type' ? 'string' : '';
					}
				} else if (instance === 'Boolean') {
					return type === 'type' ? 'boolean' : obj.defaultValue;
				} else if (instance === 'Array') {
					if (obj.caster.instance === 'ObjectId') {
						return type === 'type' ? 'string[] | []' : [];
					} else if (obj.caster.instance === 'Number') {
						return type === 'type' ? obj.options.type.map((t: any) => 'number') : [];
					}
				} else if (instance === 'Number') {
					return type === 'type' ? 'number' : 0;
				} else if (!instance) {
					let nestedPathTypeObj: { [key: string]: any } = {};
					let nestedPathInitObj: { [key: string]: any } = {};
					let nestedPathArr = Object.entries(obj.options.type.obj);
					for (let i = 0; i < nestedPathArr.length; i++) {
						nestedPathTypeObj[nestedPathArr[i][0]] = resolveObj(obj.options.type.paths[nestedPathArr[i][0]], 'type');
						nestedPathInitObj[nestedPathArr[i][0]] = resolveObj(obj.options.type.paths[nestedPathArr[i][0]], 'initVal');
					}
					return type === 'type' ? nestedPathTypeObj : nestedPathInitObj;
				}
			}
		} catch (err) {
			console.log('URL not working', err)
		}
	}
	return {
		ManagePageFormDataTypeObj,
		initialValueObj,
		AllModelNamesTypeStr,
		editItemTraceObjType,
		editItemTraceObjInitObj
	}
}