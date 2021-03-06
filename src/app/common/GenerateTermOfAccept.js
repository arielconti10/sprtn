/**
 * Gera termo de aceite de escolas
 * 
 * user - usuário  portador do termo.
 *  
 * data - Array de objetos contendo os dados das escolas
 * 
 * @param {string} user
 * @param {[Object]} data
 */
export const generateTermOfAccept = (user, data) => {
    let schoolDataPublic = '';
    let schoolDataPartic = '';
    let schoolDataSecret = '';

    let numStudents = 0;

    let dataPublic = [];
    let dataPartic = [];
    let dataSecret = [];

    let totalPublic = 0;
    let totalPartic = 0;
    let totalSecret = 0;

    data.map(school => {
        let type = school['school_type']['identify'];

        let data = {};
        data['name'] = school['name'];
        data['mec_inep_code'] = school['mec_inep_code'];
        data['city'] = school['city'];
        data['total_students'] = school['total_students'];

        switch (type) {
            case 'PUBLICO':
                dataPublic.push(data);
                break;
            case 'PARTICULAR':
                dataPartic.push(data);
                break;
            default:
                dataSecret.push(data);
        }
    });

    if (dataPublic.length) {
        let dataReturn = getSchoolData(dataPublic);

        schoolDataPublic = dataReturn[0];
        totalPublic = dataReturn[1];
    }

    if (dataPartic.length) {
        let dataReturn = getSchoolData(dataPartic);

        schoolDataPartic = dataReturn[0];
        totalPartic = dataReturn[1];
    }

    if (dataSecret.length) {
        let dataReturn = getSchoolData(dataSecret);

        schoolDataSecret = dataReturn[0];
        totalSecret = dataReturn[1];
    }

    let dtToday = new Date;

    let content = '-------------------------------  FTD EDUCACAO  --------------------- ' + brDate(false, dtToday) + '\r\n' +
        '-------------------------- TERMO DE ACEITE DE CARTEIRA ------------------------\r\n' +
        '\r\n' +
        `CONSULTOR.................: ${user} \r\n` +
        `QTD. TOTAL DE ESCOLAS.....: ${data.length} \r\n` +
        `QTD. TOTAL DE ALUNOS......: ${parseInt(totalPublic + totalPartic + totalSecret)} \r\n` +
        '\r\n' +
        `QTD. ESCOLAS PÚBLICO......: ${dataPublic.length} / ${totalPublic} ALUNOS \r\n` +
        `QTD. ESCOLAS PARTICULAR...: ${dataPartic.length} / ${totalPartic} ALUNOS \r\n` +
        `QTD. ESCOLAS SECRETARIA...: ${dataSecret.length} / ${totalSecret} ALUNOS \r\n` +
        '\r\n' +
        'ESTE DOCUMENTO FORMALIZA O ACEITE DA CARTEIRA DE ESCOLAS ABAIXO RELACIONADAS   \r\n' +
        `PARA ATUACAO COMERCIAL PELO CONSULTOR ${user.toUpperCase()} \r\n` +
        '\r\n';

    if (schoolDataPublic != '') {
        content += generateHeader('PÚBLICO', totalPublic) +
            'NU.       ESCOLA                                  INEP     CIDADE              \r\n' +
            '-------------------------------------------------------------------------------\r\n' +
            schoolDataPublic + '\r\n';
    }

    if (schoolDataPartic != '') {
        content += generateHeader('PARTICULAR', totalPartic) +
            'NU.       ESCOLA                                  INEP     CIDADE              \r\n' +
            '-------------------------------------------------------------------------------\r\n' +
            schoolDataPartic + '\r\n';
    }

    if (schoolDataSecret != '') {
        content += generateHeader('SECRETARIA', totalSecret) +
            'NU.       ESCOLA                                  INEP     CIDADE              \r\n' +
            '-------------------------------------------------------------------------------\r\n' +
            schoolDataSecret + '\r\n';
    }

    content += '-------------------------------------------------------------------------------\r\n' +
        '' + '\r\n' +
        '' + '\r\n' +
        '_______________________________________                                        \r\n' +
        '' + user + '\r\n' +
        '';

    let filename = 'TERMO_DE_ACEITE_DE_CARTEIRA.txt';
    let contentType = 'application/octet-stream';
    let a = document.createElement('a');
    let blob = new Blob([content], { 'type': contentType });

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    a.remove();
}
const generateHeader = (type, students) => {

    let data = new Date();
    let nextYear = data.getFullYear() + 1;
    let text = ` ${type} - ${students} ALUNOS `;

    let qtd = (80 - text.length) / 2;

    let header = addString('-', qtd)
        + text
        + addString('-', qtd)
        + '\r\n';

    return header;
}

const addZero = (value) => {

    value = value.toString();

    if (value.length == 1) {
        value = `00${value}`;
    } else if (value.length == 2) {
        value = `0${value}`;
    }
    return value;
}

const validateRegister = (data, value) => {
    let text = '';

    if (data == 'escola') {
        if (value) {
            text = writeRegister(value, 39);
        } else {
            text = 'Registro indisponível' + addString('\xa0', 18);
        }
    } else if (data == 'inep') {
        if (value) {
            text = writeRegister(value, 8);
        } else {
            text = '--------';
        }
    } else {
        if (value) {
            text = writeRegister(value.toUpperCase(), 22);
        } else {
            text = 'Registro indisponível';
        }
    }

    return text;
}

const addString = (string, qtd) => {
    let witheSpace = '';
    for (let i = 1; i <= qtd; i++) {
        witheSpace += string;
    }
    return witheSpace;
}

const writeRegister = (value, width) => {
    let ret = '';
    if (value.length > width) {
        ret = value.substr(0, width);
    } else {
        let i = value.length;
        let qtd = width - i;

        ret = value + addString('\xa0', qtd);
    }

    return ret;
}

const brDate = (calend, d) => {
    function pad(n) { return n < 10 ? '0' + n : n }
    if (calend) {
        return pad(d._d.getUTCDate()) + '/'
            + pad(d._d.getUTCMonth() + 1) + '/'
            + pad(d._d.getUTCFullYear());
    } else {
        return pad(d.getUTCDate()) + '/'
            + pad(d.getUTCMonth() + 1) + '/'
            + pad(d.getUTCFullYear());
    }
}

const getSchoolData = (array) => {
    let i = 0;
    let schoolData = '';
    let numStudents = 0;
    let numSchools = array.length;

    array.map(school => {
        let j = i + 1;
        numStudents += (isNaN(parseInt(school['total_students']))) ? 0 : parseInt(school['total_students']);

        schoolData += `${addZero(j)} / ${addZero(numSchools)}`
            + ' '
            + validateRegister('escola', school['name'])
            + ' '
            + validateRegister('inep', school['mec_inep_code'])
            + ' '
            + validateRegister('cidade', school['city'])
            + '\r\n';

        i++;
    });

    let data = [schoolData, numStudents];

    return data;
}