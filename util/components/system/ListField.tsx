import React, { useEffect, useState } from 'react';
import ListFieldItem from './ListFieldItem';
import {
	Box,
	Button,
	Flex,
	ButtonGroup,
	Input,
	Text
} from '@chakra-ui/react'
import { dataInitialValue, useManagePageForm } from '../../contexts/useManagePageForm';
import { assetsEnumValueArr, templatesEnumValueArr } from '../../../models/model-types';
import { OptionsType } from '../../../models/model-types';
import { AllDocUnionType } from '../types/util_types';
import { cloneDeep } from 'lodash';

const ListField = ({
		obj,
		title,
		singleChoice
	}: {
		obj: { options: OptionsType & { ref?: string; }; caster?: { options: OptionsType & { ref?: string; } }; instance: string; };
		title: string;
		singleChoice: boolean | undefined;
	}) => {
	const [availableItems, setAvailableItems] = useState<AllDocUnionType[]>([]);
	const [chosenItems, setChosenItems] = useState<AllDocUnionType[]>([]);
	const [itemFilter, setItemFilter] = useState('');
	const [itemFilterArr, setItemFilterArr] =
		useState<typeof templatesEnumValueArr | typeof assetsEnumValueArr | null>([]);
	const [textFilter, setTextFilter] = useState('');
	const { formSelected, setFormSelected, data, setData } = useManagePageForm();
	const { formTitle, parentId } = formSelected;

	useEffect(() => {
		let itemFilterArr;
		if (obj.options.filterType) {
			itemFilterArr = formTitle === 'Page' ? templatesEnumValueArr : assetsEnumValueArr;
		} else {
			itemFilterArr = null;
		}
		setItemFilterArr(itemFilterArr)
		setItemFilter(itemFilterArr?.[0] ?? '')
	}, [])

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const paramsObj: { schema: string; nestedItemIds?: string; itemType?: string; } =
				{ schema: obj.caster?.options?.ref ?? obj.options?.ref ?? '' };
			if (data?.[formTitle]?.[title]) {
				paramsObj['nestedItemIds'] = data?.[formTitle]?.[title].map((obj: any) => obj._id);
			}
			if (itemFilter) {
				paramsObj['itemType'] = itemFilter;
			}
			const params = new URLSearchParams(paramsObj);
			const res = await fetch(`/api/get_list_field_items?${params}`);
			const resData = await res.json();
			const { availableItems, chosenItems } = resData;
			setAvailableItems(availableItems);
			setChosenItems(chosenItems);
		}
	}, [itemFilter, formSelected]);

	if ((obj.options?.nested && data[formTitle]._id) || (formTitle !== obj.caster?.options?.ref)) {
		return (
			<Flex
				flexDir='column'
			>
				<Box
					outline='black solid .1rem'
					borderRadius='.2rem'
					height={singleChoice ? '100px' : '400px'}
					overflow='auto'
					my='1rem'
					padding='.5rem'
				>
					{
						chosenItems?.map((item, index) => {
							return <ListFieldItem
								key={item._id}
								item={item}
								title={title}
								chosen='true'
								index={index}
								setChosenItems={setChosenItems}
								setAvailableItems={setAvailableItems}
								chosenItems={chosenItems}
								singleChoice={singleChoice}
							/>
						})
					}
					{
						!chosenItems?.length && 'No items chosen'
					}
				</Box>
				<Button
					width='fit-content'
					onClick={() => {
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.formTitle = obj.caster?.options.ref ?? '';
							newData.prevFormTitle = newData.formTitle;
							newData.parentId = data[formTitle]._id;
							if (formTitle === 'Page') {
								newData.parentIdentStr = data[formTitle].folderHref;
							}
							return newData;
						})
						if (formTitle === obj.caster?.options?.ref) {
							setData(prev => {
								const newData = cloneDeep(prev);
								newData[formTitle] = cloneDeep(dataInitialValue[formTitle]);
								return newData;
							})
						}
					}}
				>
					Create New {obj.caster?.options?.ref ?? obj.options?.ref}
				</Button>
				{!obj.options?.nested &&
					<>
						<ButtonGroup gap='1' mt='1rem' flexWrap='wrap'>
							{
								itemFilterArr?.map(str => {
									return <Button
										key={str}
										variant={str === itemFilter ? 'ghost' : 'outline'}
										onClick={() => {
											setItemFilter(str)
										}}
									>
										{str}
									</Button>
								})
							}
						</ButtonGroup>
						<Box
							pt='1rem'
						>
							<Input
								value={textFilter}
								width='35%'
								placeholder={`Search ${obj.caster?.options?.ref ?? obj.options?.ref}`}
								onInput={e => {
									setTextFilter((e.target as HTMLInputElement).value)
								}}
							/>
						</Box>
						<Box
							outline='black solid .1rem'
							borderRadius='.2rem'
							height='400px'
							overflow='auto'
							my='1rem'
							padding='.5rem'
						>
							{
								availableItems
									?.filter(item => {
										const regexp: RegExp = new RegExp(textFilter, 'i')
										return (item as any).title?.match(regexp) ||
											(item as any).description?.match(regexp) ||
											(item as any).richDescription?.match(regexp)
									})
									?.map((item, index) => {
										return <ListFieldItem
											key={item._id}
											item={item}
											title={title}
											index={index}
											chosen='false'
											setAvailableItems={setAvailableItems}
											setChosenItems={setChosenItems}
											singleChoice={singleChoice}
										/>
									})
							}
							{
								!availableItems?.length && 'No items to choose'
							}
						</Box>
					</>
				}
			</Flex>
		)
	} else {
		return <Text>{`Create, then edit to add nested ${obj.caster?.options?.ref.toLowerCase()}`}</Text>;
	}
}

export default ListField;