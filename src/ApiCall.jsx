import axios from 'axios';


const ApiCall = async (method, endPointUrl, data = null, params = null) => {

    const localhost = 'http://localhost:8000';
    // const basURL = "https://sps-backend.vercel.app";
    const url = `${localhost}/${endPointUrl}`;
    try {
        let response;

        switch (method.toLowerCase()) {
            case 'get':
                response = await axios.get(url, { params: data });
                break;
            case 'post':
                response = await axios.post(url, data );
                break;
            case 'put':
                response = await axios.put(url, data );
                break;
            case 'delete':
                response = await axios.delete(url, {
                    data: data,
                });
                break;
            default:
                throw new Error('Invalid method');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export default ApiCall;
