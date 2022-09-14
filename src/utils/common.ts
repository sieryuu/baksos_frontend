import { AxiosResponse } from "@umijs/max";

export const downloadFile = (response: AxiosResponse) => {
    let contentDisposition = response?.headers["content-disposition"]
        ?.split("filename=");
    let filename: string = "";
    if (contentDisposition && contentDisposition.length > 1) {
        filename = contentDisposition[1].replaceAll('"', "");
    }

    let url = window.URL.createObjectURL(response.data);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
};