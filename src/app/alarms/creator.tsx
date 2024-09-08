import { AlarmHelper } from "components/alarms/AlarmHelper"
import SecondaryText from "components/reusables/SecondaryText"
import SimplyButton from "components/ui/SimplyButton"
import { View } from "react-native"
import { useMutation } from "react-query"

/* 
feature list

when route
	is_about_to_arrive
		radius
		minute
		stop
	passes
		stop
	goes_live
*/

export default function ScreenAlarmCreator() {
	const { data, isLoading, mutateAsync } = useMutation({
		mutationKey: ["create-alarm"],
		mutationFn: async () => {
			// return false

			return await AlarmHelper.createAlarm({
				label: "test alarm",
				type: "creation",
				routes: [
					{
						type: "display",
						id: "33",
					},
				],
				stops: ["12106"],
				
				data: {
					type: "range",
					range: 0.03,
				},
			})
		},
	})
	return (
		<View>
			<SimplyButton text="test" onPress={() => mutateAsync()} style={{ width: 40 * 4 }} type="secondary" size="medium" />
			<SecondaryText>{JSON.stringify(data, undefined, 4)}</SecondaryText>
		</View>
	)
}
