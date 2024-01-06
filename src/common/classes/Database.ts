import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "../Logger";



export default abstract class Database {
	public static async get(key: string) {
		try {
			const data= await AsyncStorage.getItem(key) as string
			if (!data) return null
			const jsondata = JSON.parse(data)

			return jsondata || null
		} catch (e : string | any) {
			// Logger.warning("Database.get",e)
			return null
		}
	}
	public static async set(key: string, value: Map<any,any>|Array<any>|string|boolean|number|undefined|null) {
		try {
			await AsyncStorage.setItem(key, JSON.stringify(value))
		} catch (e : string | any) {
			Logger.error("Database.set",e)
		}
	}
}