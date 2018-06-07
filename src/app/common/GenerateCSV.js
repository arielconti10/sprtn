/**
 * Gera e exporta CSV
 * 
 * data - Array de objetos a serem exportados.
 * 
 * columnDelimiter - delimitador de colunas (default ';').
 * 
 * lineDelimiter - delimitador de linhas (default '\n').
 * 
 * fileName - nome do arquivo (default 'export').
 * 
 * @param {Object} args
 * @param {[Object]} args.data
 * @param {String} args.columnDelimiter
 * @param {String} args.lineDelimiter
 * @param {String} args.fileName
 */
export const convertArrayOfObjectsToCSV = (args) => {
    let result, ctr, keys, columnDelimiter, lineDelimiter, fileName, data, link, csv;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ';';
    lineDelimiter = args.lineDelimiter || '\n';
    fileName = args.fileName || 'export.csv';

    if (!fileName.match(/.csv/i)) {
        fileName = `${fileName}.csv`;
    }

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    
    if (result == null) 
        throw('Problema ao gerar CSV!');


    if (!result.match(/^data:text\/csv/i)) {
        result = `data:text/csv;charset=utf-8,${result}`;
    }

    csv = encodeURI(result);

    link = document.createElement('a');
    link.setAttribute('href', csv);
    link.setAttribute('download', fileName);
    link.click();
    link.remove();
}