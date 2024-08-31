import AsyncStorage from "@react-native-async-storage/async-storage"
import ApplicationConfig from "common/ApplicationConfig"
import BaseFKartResponse from "common/interfaces/FKart/BaseFKartResponse"
import Logger from "common/Logger"
import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
interface AccountlessStore {
}
const storage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		const data = (await ApplicationConfig.database.get(`zustand.accountless.${name}`)) || null
		return data
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await ApplicationConfig.database.set(`zustand.accountless.${name}`, value)
	},
	removeItem: async (name: string): Promise<void> => {
		await ApplicationConfig.database.removeItem(`zustand.accountless.${name}`)
	},
}

export const useAccountlessStore = create<AccountlessStore>()(
	persist(
		(set) => ({
			
		}),
		{
			name: "accountless-storage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => storage), // (optional) by default, 'localStorage' is used
		}
	)
)
