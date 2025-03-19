import axios, { AxiosResponse } from 'axios';
import { coreBaseUrl } from '../constants';

const axiosInstance = axios.create({
    baseURL: coreBaseUrl,
    timeout: 1000,
});

export default class RuleService {
    async deleteRule(
        username: string,
        password: string,
        ruleName: string
    ): Promise<AxiosResponse<any, any> | undefined> {
        let request;
        try {
            request = await axiosInstance.delete(`/rule/${ruleName}`, {
                auth: {
                    username,
                    password,
                },
            });
        } catch (error) {
            console.error(error);
        }
        return request;
    }
}
