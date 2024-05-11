import { useState } from "react"
import InputModal from "components/root/InputModal";
import { formatAlias } from "common/util"

export function FavoriteCardInputAliasModal(props: { onDismiss?: () => void; visible: boolean; onSave?: (output: string) => void }) {
	if (!props.visible) {
		return
	}
	function reverse(s: string) {
		return s.split("").reverse().join("")
	}
	return (
		<InputModal
			formatter={(input) => {
				const clear_input = input.replaceAll("-", "")
				const length = clear_input.length
				const formatted = formatAlias(clear_input)
				let result = formatted
				let to_clear = 0
				if (length <= 5) to_clear++
				if (length <= 10) to_clear++
				for (let i = 0; i < to_clear; i++) {
					result = reverse(reverse(result).replace("-", ""))
				}
				result = result.replaceAll("X", "")
				return result
			}}
			onSave={(str) => {
				if (props.onSave) {
					props.onSave(str.replaceAll("-", ""))
				}
			}}
			visible={true}
			onDismiss={props.onDismiss || (() => {})}
			config={{ cancel: "Cancel", confirm: "Save", title: "Enter your card id:", placeholder: "XXXXX-XXXXX-X" }}
		/>
	)
}
