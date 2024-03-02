import { useState, useEffect, useMemo } from 'react';
import {
	Button,
	Text,
	Heading,
	Flex
} from '@chakra-ui/react';
import { useManagePageForm, ManagePageFormDataType, dataInitialValue } from '../../contexts/useManagePageForm';
import { cloneDeep, kebabCase } from 'lodash';

const FormCancel = ({}) => {
	const {
		setData,
		formSelected,
		setFormCache
	} = useManagePageForm();
	return (
		<Button
			colorScheme='blue'
			mr={3}
			onClick={(e) => {
				setFormCache((prev: any) => {
					let newFormCacheData = cloneDeep(prev);
					const activeItem = newFormCacheData[newFormCacheData.active];
					const previousItem = newFormCacheData[activeItem.previous];
					newFormCacheData.active = activeItem.previous;
					setData(prev => {
						const newData = cloneDeep(prev);
						newData[previousItem.formTitle] = previousItem;
						return newData;
					})
					delete newFormCacheData[activeItem._id]
					return newFormCacheData;
				});
			}}
			isDisabled={formSelected.loading}
		>
			Cancel
		</Button>
	)
}

export default FormCancel;