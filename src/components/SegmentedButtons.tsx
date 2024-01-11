import { Text, TouchableOpacity, View } from "react-native"
import Application from "../common/Application"
import React, { useEffect, useMemo, useState } from "react"

export default function SegmentedButtons(props: {
	values: Array<{
		label?: string
		key: string
		value?: any
		onPress?: () => void
	}>
	onSelect: ({
		label,
		key,
		value,
	}: {
		label?: string
		key: string
		value?: any
	}) => void
	defaultKey?: string
}) {
	const { values, onSelect, defaultKey: defaultKey } = props
	const [selected, setSelected] = useState(
		values.find((value) => value.key === defaultKey) ||
			values[0]
	)
	return useMemo(
		() => (
			<View
				className="flex-row  rounded-full overflow-hidden"
				style={{
					borderColor: Application.styles.primary,
					borderWidth: 2,
					borderRadius: 100,
				}}
			>
				{values.map((item, index) => (
					<React.Fragment key = {`${index}-fragment`}>
						<TouchableOpacity
							key={`${item.key}-${index}-data`}
							style={{
								backgroundColor:
									selected.value === item.value
										? Application.styles.primary
										: Application.styles.white,
							}}
							className="px-4 py-2 items-center justify-center"
							onPress={() => {
								setSelected(item)
								selected.onPress?.()
								onSelect(item)
							}}
						>
							<Text
								className="text-center"
								style={{
									color: Application.styles.secondary,
									fontWeight: "bold",
									fontSize: 16,
								}}
							>
								{item.label}
							</Text>
						</TouchableOpacity>
						{index + 1 === values.length ? null : (
							<View
								key={`${item.key}-${index}-separator`}
								className="opacity-10 h-2/3 self-center w-0.5 "
								style={{ backgroundColor: Application.styles.secondary }}
							/>
						)}
					</React.Fragment>
				))}
			</View>
		),
		[selected]
	)
}
