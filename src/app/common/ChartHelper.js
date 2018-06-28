/**
 * mapeia um Array de objetos de modo a ser utilizado pelo gráfico de pizza do Google Charts
 * transformando o Array no formato desejado pelo Google Charts
 * @param { String } label rótulo a ser utilizado no gráfico 
 * @param { String } field_name campo referente a legenda
 * @param { Float } field_total campo referente ao total
 * @param { Array } result resultados a serem percorridos
 * @return { Array } array_chart lista formatada
 */
export function mapPieChart(label, field_name, field_total, result) {
    let array_chart = [];

    if (result && result.length > 0) {
        result.map(item => {
            if (item[field_total] > 0) {
                const array_tmp = [item[field_name], parseFloat(item[field_total])];
                array_chart.push(array_tmp);
            }
        });
    }

    array_chart.sort(function (a, b) {
        if(a[0] < b[0]) return -1;
        if(a[0] > b[0]) return 1;
        return 0;
    });

    array_chart.unshift([label, "%"]);

    return array_chart;
}