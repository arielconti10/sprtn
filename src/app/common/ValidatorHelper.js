/**
 * realiza a validaçāo de cpf, e informa se é um cpf válido ou inválido
 * @param {String} cpf 
 * @return {Bool} flag indicando se é válido ou inválido
 */
export function validateCPF(cpf) {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	let add = 0;	
	for (let i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		let rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (let i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
        return false;		
        
	return true;   
}

/**
 * realiza a validaçāo de e-mail, informando se é válido ou inválido
 * @param {String} email e-mail informado
 * @return {Bool} flag indicando se é válido ou inválido
 */
export function validateEmail(email) {
    return (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email));
}

/**
 * valida se uma data tem formato válido
 * @param {String} dateStr data informada
 * @return {Bool} flag indicando se é válido ou inválido
 */
export function validateDate(dateStr) {
    let chars = dateStr.match(/\d/g);
    let totalCharts = 0;

    if (chars) {
        totalCharts = chars.length;
    }
    
    if (totalCharts === 8) {
        return true;
    } else {
        return false;
    }
}

/**
 * valida o total de caracteres do CEP
 * @param {String} zipCode cep informado
 * @return {Bool} flag indicando se é válido ou inválido
 */
export function validateZipCode(zipCode) {
    let chars = zipCode.match(/\d/g);
    let totalCharts = 0;

    if (chars) {
        totalCharts = chars.length;
    }
    
    if (totalCharts === 8) {
        return true;
    } else {
        return false;
    }
}