import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ThemeContext } from "common/contexts/ThemeContext"
import { useContext, useRef, useState } from "react"
import { Animated, PanResponder, Text, View } from "react-native"

export interface DragItem {
	key: string
	label: string
	sublabel?: string
	icon: string
}

/** every row takes this much height (row + gap), so a drag of ROW px moves one place */
const ROW = 60

/**
 * Drag & drop list built on PanResponder + Animated from react-native itself (no native modules,
 * so it runs on old app builds too). Drag a row by its handle; the others slide out of the way.
 */
export default function DragList(props: { items: DragItem[]; onChange: (keys: string[]) => void; onDragging?: (dragging: boolean) => void }) {
	const [drag, setDrag] = useState<{ from: number; to: number } | undefined>()
	const dy = useRef(new Animated.Value(0)).current
	// the responders read these, so they always see the latest list and callbacks
	const latest = useRef(props)
	latest.current = props
	const dragRef = useRef(drag)
	dragRef.current = drag

	function start(index: number) {
		dy.setValue(0)
		setDrag({ from: index, to: index })
		latest.current.onDragging?.(true)
	}
	function move(index: number, offset: number) {
		dy.setValue(offset)
		const to = Math.max(0, Math.min(latest.current.items.length - 1, index + Math.round(offset / ROW)))
		if (dragRef.current?.to !== to) setDrag({ from: index, to })
	}
	function end() {
		const current = dragRef.current
		setDrag(undefined)
		dy.setValue(0)
		latest.current.onDragging?.(false)
		if (!current || current.from === current.to) return
		const keys = latest.current.items.map((e) => e.key)
		const [moved] = keys.splice(current.from, 1)
		keys.splice(current.to, 0, moved)
		latest.current.onChange(keys)
	}

	return (
		<View style={{ height: props.items.length * ROW }}>
			{props.items.map((item, index) => {
				let shift = 0
				if (drag && index !== drag.from) {
					if (drag.from < drag.to && index > drag.from && index <= drag.to) shift = -ROW
					if (drag.from > drag.to && index < drag.from && index >= drag.to) shift = ROW
				}
				return <DragRow key={item.key} item={item} index={index} active={drag?.from === index} shift={shift} dy={dy} onStart={start} onMove={move} onEnd={end} />
			})}
		</View>
	)
}

function DragRow(props: {
	item: DragItem
	index: number
	active: boolean
	shift: number
	dy: Animated.Value
	onStart: (index: number) => void
	onMove: (index: number, offset: number) => void
	onEnd: () => void
}) {
	const { theme } = useContext(ThemeContext)
	const latest = useRef(props)
	latest.current = props
	const responder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			// keep the gesture when the surrounding ScrollView wants it
			onPanResponderTerminationRequest: () => false,
			onPanResponderGrant: () => latest.current.onStart(latest.current.index),
			onPanResponderMove: (_, g) => latest.current.onMove(latest.current.index, g.dy),
			onPanResponderRelease: () => latest.current.onEnd(),
			onPanResponderTerminate: () => latest.current.onEnd(),
		})
	).current
	const translateY = props.active ? props.dy : props.shift
	return (
		<Animated.View
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				top: props.index * ROW,
				height: ROW - 8,
				zIndex: props.active ? 10 : 0,
				elevation: props.active ? 8 : 2,
				transform: [{ translateY }, { scale: props.active ? 1.03 : 1 }],
				flexDirection: "row",
				alignItems: "center",
				gap: 12,
				paddingLeft: 14,
				borderRadius: 14,
				backgroundColor: props.active ? "#FFF8D1" : theme.white,
			}}
		>
			<MaterialCommunityIcons name={props.item.icon as any} size={22} color={theme.primaryDark} />
			<View style={{ flex: 1 }}>
				<Text numberOfLines={1} style={{ color: theme.secondary, fontWeight: "800", fontSize: 15 }}>
					{props.item.label}
				</Text>
				{props.item.sublabel ? (
					<Text numberOfLines={1} style={{ color: theme.secondary, opacity: 0.6, fontWeight: "700", fontSize: 12 }}>
						{props.item.sublabel}
					</Text>
				) : null}
			</View>
			<View {...responder.panHandlers} accessibilityLabel={`Drag to move ${props.item.label}`} style={{ width: 56, height: ROW - 8, alignItems: "center", justifyContent: "center" }}>
				<MaterialCommunityIcons name="drag-horizontal-variant" size={26} color={theme.secondary} />
			</View>
		</Animated.View>
	)
}
