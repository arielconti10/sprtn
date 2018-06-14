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
    array_chart[0] = [label, "%"];
    result.map(item => {
        if (item[field_total] > 0) {
            const array_tmp = [item[field_name], parseFloat(item[field_total])];
            array_chart.push(array_tmp);
        }
    });

    return array_chart;
}