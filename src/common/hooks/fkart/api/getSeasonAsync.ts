import axios from "axios";

export default async function getSeasonAsync() {
	return axios("https://api.fkart.project.phasenull.dev/season")
}