import { drizzleDB } from "app/_layout"
import { alarms, MixedTripyRoutyDisplayishThing } from "common/schema"
import * as TaskManager from "expo-task-manager"
import * as BackgroundFetch from "expo-background-fetch"
import * as Notifications from "expo-notifications"
import { sql } from "drizzle-orm"
export abstract class AlarmHelper {
	static async createAlarm(arg: typeof alarms.$inferInsert) {
		const deleted = await drizzleDB.delete(alarms).run()
		const [{ id: alarmId }] = await drizzleDB
			.insert(alarms)
			.values({
				label: arg.label,
				data: arg.data,
			})
			.returning({
				id: alarms.id,
			})

		// if (!alarmId) throw new Error("Alarm.id is undefined!")
		// const taskName = `alarm-${alarmId}`
		// const definedTask = await TaskManager.defineTask(taskName, async () => {
		// 	const now = Date.now()
		// 	schedule()
		// 	console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`)

		// 	// Be sure to return the successful result type!
		// 	return BackgroundFetch.BackgroundFetchResult.NewData
		// })
		await TaskManager.unregisterAllTasksAsync()
		// await BackgroundFetch.registerTaskAsync(taskName, {
		// 	startOnBoot: true,
		// 	stopOnTerminate: true,
		// 	minimumInterval: 15,
		// })
		// const scheduled = await TaskManager.getRegisteredTasksAsync()
		await schedule()
		return {
			alarm: { ...arg, id: alarmId },
			// alarm_task: taskName,
			extra: { deleted: deleted,status:await BackgroundFetch.getStatusAsync() },
			// scheduled: scheduled,
		}
	}
}
async function schedule() {
	await Notifications.scheduleNotificationAsync({
		identifier: "test",
		content: {
			sound:"defaultCritical",
			title: "King Bob",
			interruptionLevel: "timeSensitive",
			vibrate: [0, 5000],
			body: "Bello!",
		},
		trigger: null,
	})
}
