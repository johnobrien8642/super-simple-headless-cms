import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { truncate } from 'lodash';
import { useManagePageForm } from '../contexts/useManagePageForm';

const ListFieldItem = ({ item, type }) => {
	const { setPageFormData, setOpenModal } = useManagePageForm();
	const styleProps = {
		as: 'span',
		mx: '1rem',
		textAlign: 'center'
	}

	return (
		<>
			{
				item?.title && <Text {...styleProps}>{item.title}</Text>
			}
			{
				item?.description && <Text {...styleProps}>{truncate(item.description, { length: 100 })}</Text>
			}
			{
				item?.templateType && <Text {...styleProps}>{item.templateType}</Text>
			}
			{
				<Button
					onClick={() => {
						setPageFormData(item)
						setOpenModal(true)
					}}
				>
					Edit
				</Button>
			}
		</>
	)
}

export default ListFieldItem;