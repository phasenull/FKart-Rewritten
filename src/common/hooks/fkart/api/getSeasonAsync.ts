import axios from "axios";
import Application from "common/Application";

export default async function getSeasonAsync() {
	return axios(`${Application.fkart_endpoints.api}/season/get`)
}