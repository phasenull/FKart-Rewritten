import axios from "axios";
import ApplicationConfig from "common/ApplicationConfig";

export default async function getSeasonAsync() {
	return axios(`${ApplicationConfig.fkart_endpoints.api}/season/get`)
}