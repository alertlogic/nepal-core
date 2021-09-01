/**
 *  A service used as a CSV converter.
 *
 *  @author Jhon Pantoja <jhon.pantoja@alertlogic.com>
 *
 *  @copyright 2018 Alert Logic, Inc.
 */

export class CsvConverter {
    /**
     *  @method exportToCSV
     *
     *  It allows to export csv file in the browser.
     *
     *  @param {any} rawData The json data that needs to be converted.
     *  @param {string} fileName Name of the csv file that will be downloaded.
     *
     */
    public exportToCSV = (rawData: any, fileName: string) => {
        let rawCsv = this.getCsvData(rawData);
        let file: any = document.createElement("a");
        file.setAttribute('style', 'display:none;');
        document.body.appendChild(file);
        let csv = new Blob([rawCsv], { type: 'text/csv' });
        let downloadUrl = window.URL.createObjectURL(csv);
        file.href = downloadUrl;
        // IE support
        let isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;
        if (isIE) {
            let ieFile = navigator.msSaveBlob(csv, fileName + '.csv');
        } else {
            file.download = fileName + '.csv';
        }
        file.click();
    }
    /**
     *  @method getCsvData
     *
     *  It builds a CSV structure data, transforming the data received into an array to
     *  start creating the csv string data.
     *
     *  @param {any} data The json data that it will be translated into CSV.
     *
     *  @returns {string} rawCsv The csv file in string format.
     */
    public getCsvData = (data: any) => {
        let arrayData = typeof data !== 'object' ? JSON.parse(data) : data;
        let rawCsv = '';
        let header = "";
        // Getting header
        for (let index in arrayData[0]) {
            if (arrayData[0].hasOwnProperty(index)) {
                header += index + ',';
            }
        }
        header = header.slice(0, -1);
        rawCsv += header + '\r\n';
        // Getting results
        for (let result = 0; result < arrayData.length; result++) {
            let line = '';
            line = '"' + Object.keys(arrayData[result]).map(key => arrayData[result][key].toString().replace(/"/g, '""')).join('","') + '"';
            rawCsv += line + '\r\n';
        }
        return rawCsv;
    }
    /**
     *  @method exportFromCsvString
     *
     *  It allows to export csv file in the browser.
     *
     *  @param {string} rawCsv The string to be downloaded.
     *  @param {string} fileName Name of the csv file that will be downloaded.
     *
     */
    public exportCsvFromString = (rawCsv: string, fileName: string) => {
        let mimeType = "text/csv";
        let fileExtension = "csv";
        this.exportFileFromString(rawCsv, fileName, mimeType, fileExtension);
    }

    /**
     *  @method exportFromJsonString
     *
     *  It allows to export json file in the browser.
     *
     *  @param {string} rawJson The string to be downloaded.
     *  @param {string} fileName Name of the json file that will be downloaded.
     *
     */
    public exportJsonFromString = (rawJson: string, fileName: string) => {
        let mimeType = "text/json";
        let fileExtension = "json";
        this.exportFileFromString(rawJson, fileName, mimeType, fileExtension);
    }

    /**
     *  @method exportFromFileString
     *
     *  It allows to export csv file in the browser.
     *
     *  @param {string} rawString The string to be downloaded.
     *  @param {string} fileName Name of the csv file that will be downloaded.
     *  @param {string} mimeType The mime type of the file to be downloaded.
     *  @param {string} fileExtension The file extension of the file to be downloaded.
     *
     */
    public exportFileFromString = (rawString: string, fileName: string, mimeType: string, fileExtension: string) => {
        let file: any = document.createElement("a");
        file.setAttribute('style', 'display:none;');
        document.body.appendChild(file);
        let archive = new Blob([rawString], { type: mimeType });
        let downloadUrl = window.URL.createObjectURL(archive);
        file.href = downloadUrl;
        // IE support
        let isIE = /*@cc_on!@*/ false || !!(<any>document).documentMode;
        if (isIE) {
            let ieFile = navigator.msSaveBlob(archive, fileName + '.' + fileExtension);
        } else {
            file.download = fileName + '.' + fileExtension;
        }
        file.click();
    }
}
